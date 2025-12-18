// ---------- ELEMENTS ----------
const authBox = document.getElementById("authBox");
const app = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

const message = document.getElementById("message");
const logList = document.getElementById("logList");

// buttons will be fetched AFTER DOM loads
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

    // get buttons AFTER app visible
    checkInBtn = document.getElementById("checkInBtn");
    checkOutBtn = document.getElementById("checkOutBtn");

    loadLogs();
  } else {
    app.classList.add("hidden");
    authBox.classList.remove("hidden");
  }
});

// Email login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => authError.innerText = err.message);
}

// Sign up
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .catch(err => authError.innerText = err.message);
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
  if (!auth.currentUser) {
    alert("User not logged in");
    return;
  }

  if (!checkInBtn || !checkOutBtn) return;

  // lock both during save
  checkInBtn.disabled = true;
  checkOutBtn.disabled = true;

  const now = new Date();

  db.collection("logs").add({
    user: auth.currentUser.uid,
    action: type,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    message.innerText = type + " recorded";
    updateButtonState(type);
    loadLogs();
  })
  .catch(err => {
    console.error("Log save error:", err);
    message.innerText = "Failed to save log";
    updateButtonState(type === "Check In" ? "Check Out" : "Check In");
  });
}

// ---------- LOAD LOGS ----------
function loadLogs() {
  if (!auth.currentUser) return;

  // last action → button restore
  db.collection("logs")
    .where("user", "==", auth.currentUser.uid)
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

  // full log list
  db.collection("logs")
    .where("user", "==", auth.currentUser.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      logList.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        logList.innerHTML += `
          <div class="log-item">
            <span>${d.action}</span>
            <small>${d.date} • ${d.time}</small>
          </div>
        `;
      });
    });
}
