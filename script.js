const authBox = document.getElementById("authBox");
const app = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

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

// Email login
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => authError.innerText = err.message);
}

// Sign up
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .catch(err => authError.innerText = err.message);
}

// Google login
function googleLogin() {
  auth.signInWithPopup(provider)
    .catch(err => authError.innerText = err.message);
}

// Logout
function logout() {
  auth.signOut();
}

// Log action
function logAction(type) {
  if (!auth.currentUser) {
    alert("User not logged in");
    return;
  }

  const now = new Date();
  console.log("Logging for UID:", auth.currentUser.uid);

  db.collection("logs").add({
    user: auth.currentUser.uid,
    action: type,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    message.innerText = type + " recorded";
    loadLogs();
  }).catch(err => {
    console.error("Log save error:", err);
  });
}


// Load logs
function loadLogs() {
  const uid = auth.currentUser.uid;

  db.collection("logs")
    .where("user", "==", uid)
    .orderBy("createdAt", "asc")
    .get()
    .then(snapshot => {
      const logList = document.getElementById("logList");
      logList.innerHTML = "";

      const grouped = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.createdAt) return;

        const date = data.createdAt.toDate().toLocaleDateString();

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(data);
      });

      // Process each day
      for (const date in grouped) {
        let totalMs = 0;
        let lastCheckIn = null;

        grouped[date].forEach(log => {
          const time = log.createdAt.toDate();

          if (log.action === "Check In") {
            lastCheckIn = time;
          }

          if (log.action === "Check Out" && lastCheckIn) {
            totalMs += time - lastCheckIn;
            lastCheckIn = null;
          }
        });

        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (totalMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        // Render UI
        const dayBlock = document.createElement("div");
        dayBlock.className = "log-item";
        dayBlock.innerHTML = `
          <span>${date}</span>
          <small>${hours}h ${minutes}m</small>
        `;

        logList.appendChild(dayBlock);
      }
    })
    .catch(err => {
      console.error("Load logs error:", err);
    });
}
