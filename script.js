// ---------- ELEMENTS ----------
const authBox = document.getElementById("authBox");
const app = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

const message = document.getElementById("message");
const logList = document.getElementById("logList");

let checkInBtn;
let checkOutBtn;

// ---------- AUTH TABS ----------
function showLogin() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
}

function showSignup() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
}

// ---------- AUTH STATE ----------
auth.onAuthStateChanged(user => {
  if (user) {
    authBox.classList.add("hidden");
    app.classList.remove("hidden");

    checkInBtn = document.getElementById("checkInBtn");
    checkOutBtn = document.getElementById("checkOutBtn");

    loadLogs();
  } else {
    app.classList.add("hidden");
    authBox.classList.remove("hidden");
  }
});

// ---------- LOGIN ----------
function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).catch(err => authError.innerText = err.message);
}

function signup() {
  auth.createUserWithEmailAndPassword(
    signupEmail.value,
    signupPassword.value
  ).catch(err => authError.innerText = err.message);
}

function googleLogin() {
  auth.signInWithPopup(provider)
    .catch(err => authError.innerText = err.message);
}

function logout() {
  auth.signOut();
}

// ---------- BUTTON STATE ----------
function updateButtonState(lastAction) {
  if (!checkInBtn || !checkOutBtn) return;

  if (lastAction === "Check In") {
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  } else {
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  }
}

// ---------- LOG ACTION ----------
function logAction(type) {
  if (!auth.currentUser) return;

  checkInBtn.disabled = true;
  checkOutBtn.disabled = true;

  const now = new Date();

  db.collection("logs").add({
    user: auth.currentUser.uid,
    action: type,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    message.innerText = type + " recorded";
    updateButtonState(type);
    loadLogs();
  }).catch(() => {
    message.innerText = "Error saving log";
  });
}

// ---------- LOAD LOGS ----------
function loadLogs() {
  if (!auth.currentUser) return;

  const uid = auth.currentUser.uid;

  // 🔁 Restore button state
  db.collection("logs")
    .where("user", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        updateButtonState(snapshot.docs[0].data().action);
      } else {
        checkInBtn.disabled = false;
        checkOutBtn.disabled = true;
      }
    });

  // 📜 Load all logs
  db.collection("logs")
    .where("user", "==", uid)
    .orderBy("createdAt", "asc")
    .get()
    .then(snapshot => {
      logList.innerHTML = "";

      const grouped = {};

      snapshot.forEach(doc => {
        const d = doc.data();
        if (!d.createdAt) return;

        const dateKey = d.date;
        if (!grouped[dateKey]) grouped[dateKey] = [];

        grouped[dateKey].push({
          action: d.action,
          time: d.createdAt.toDate()
        });
      });

      // 🔢 Build UI (latest day first)
      Object.keys(grouped).reverse().forEach(date => {
        let totalMs = 0;
        let lastCheckIn = null;

        grouped[date].forEach(e => {
          if (e.action === "Check In") {
            lastCheckIn = e.time;
          }
          if (e.action === "Check Out" && lastCheckIn) {
            totalMs += e.time - lastCheckIn;
            lastCheckIn = null;
          }
        });

        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs / (1000 * 60)) % 60);

      let html = `
  <div class="log-day">
    <div class="log-day-header">
      <span>${date}</span>
      <strong>${hours}h ${minutes}m</strong>
      <button class="delete-day-btn" onclick="deleteDayLogs('${date}')">🗑</button>
    </div>
`;

        grouped[date].forEach(e => {
          html += `
            <div class="log-row">
              <span>${e.action}</span>
              <small>${e.time.toLocaleTimeString()}</small>
            </div>
          `;
        });

        html += `</div>`;
        logList.innerHTML += html;
      });
    });
}
//----------Delete day logs-----------
function deleteDayLogs(date) {
  if (!auth.currentUser) return;

  if (!confirm(`Delete all logs for ${date}?`)) return;

  const uid = auth.currentUser.uid;

  db.collection("logs")
    .where("user", "==", uid)
    .where("date", "==", date)
    .get()
    .then(snapshot => {
      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    })
    .then(() => {
      loadLogs();
    })
    .catch(err => {
      console.error("Delete day logs error:", err);
      alert("Failed to delete logs");
    });
}

