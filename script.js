let actionType = "";
let streamRef = null;

function startCamera(type) {
  actionType = type;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      const video = document.getElementById("video");
      video.srcObject = stream;

      // wait for real playback
      video.play();

      // give camera a moment, then save
      setTimeout(saveLog, 1200);
    })
    .catch(err => {
      alert("Camera error: " + err.message);
    });
}

function saveLog() {
  const now = new Date();

  const logData = {
    action: actionType,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("logs").add(logData)
    .then(() => {
      document.getElementById("message").innerText =
        actionType + " recorded successfully";

      stopCamera();
      loadLogs();
    })
    .catch(err => {
      alert("Firestore error: " + err.message);
    });
}

function stopCamera() {
  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
    streamRef = null;
  }
}

function loadLogs() {
  db.collection("logs")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get()
    .then(snapshot => {
      const list = document.getElementById("logList");
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p style='color:#9ca3af'>No logs yet</p>";
        return;
      }

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

window.onload = loadLogs;
