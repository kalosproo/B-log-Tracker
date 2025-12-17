const authBox = document.getElementById("authBox");
const app = document.getElementById("app");

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
  const now = new Date();

  db.collection("logs").add({
    user: auth.currentUser.uid,
    action: type,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    message.innerText = type + " recorded";
    loadLogs();
  });
}

// Load logs
function loadLogs() {
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
