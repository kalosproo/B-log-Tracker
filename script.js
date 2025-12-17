// ---------- ELEMENTS ----------
const authBox = document.getElementById("authBox");
const app = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");

const message = document.getElementById("message");
const logList = document.getElementById("logList");

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
    loadLogs();
  } else {
    app.classList.add("hidden");
    authBox.classList.remove("hidden");
  }
});

// ---------- LOGIN / SIGNUP ----------
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => authError.innerText = err.message);
}

function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .catch(err => authError.innerText = err.message);
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

  // prevent double click spam
  checkInBtn.disabled = true;
  checkOutBtn.disabled = true;

  const now = new Date();

  db.collection("logs")
    .add({
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
      // fallback state
      updateButtonState(type === "Check In" ? "Check Out" : "Check In");
    });
}

// ---------- LOAD LOGS ----------
function loadLogs() {
  if (!auth.currentUser) return;

  // Restore last button state
  db.collection("logs")
    .where("user", "==", auth.currentUser.uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const lastAction = snapshot.docs[0].data().action;
        updateButtonState(lastAction);
      } else {
        // first time user
        checkInBtn.disabled = false;
        checkOutBtn.disabled = true;
      }
    })
    .catch(err => console.error("Load last action error:", err));

  // Load full log list
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
    })
    .catch(err => console.error("Load logs error:", err));
}
