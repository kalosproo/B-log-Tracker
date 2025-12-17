const loginBox = document.getElementById("loginBox");
const app = document.getElementById("app");

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    loginBox.classList.add("hidden");
    app.classList.remove("hidden");
    loadLogs();
  } else {
    app.classList.add("hidden");
    loginBox.classList.remove("hidden");
  }
});

// Login
function login() {
  const email = email.value;
  const password = password.value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      document.getElementById("loginError").innerText = err.message;
    });
}

// Logout
function logout() {
  auth.signOut();
}

// Log check-in / check-out
function logAction(type) {
  const now = new Date();

  db.collection("logs").add({
    user: auth.currentUser.email,
    action: type,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("message").innerText =
      type + " recorded successfully";
    loadLogs();
  });
}

// Load logs
function loadLogs() {
  db.collection("logs")
    .where("user", "==", auth.currentUser.email)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      const list = document.getElementById("logList");
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();
        const row = document.createElement("div");
        row.className = "log-item";
        row.innerHTML = `
          <div>${d.action}</div>
          <span>${d.date} • ${d.time}</span>
        `;
        list.appendChild(row);
      });
    });
}
