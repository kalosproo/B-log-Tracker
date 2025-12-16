let actionType = "";
let streamRef = null;

function startCamera(type) {
  actionType = type;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      document.getElementById("video").srcObject = stream;
      setTimeout(saveLog, 2000);
    });
}

function saveLog() {
  if (streamRef) {
    streamRef.getTracks().forEach(t => t.stop());
  }

  const now = new Date();

  const data = {
    action: actionType,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("logs").add(data).then(() => {
    document.getElementById("message").innerText =
      `${actionType} recorded at ${data.time}`;
    loadLogs();
  });
}

function loadLogs() {
  db.collection("logs")
    .orderBy("createdAt", "desc")
    .limit(10)
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

loadLogs();
