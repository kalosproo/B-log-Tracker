let streamRef = null;

function startCamera(actionType) {

  // 1. Start camera (for visual proof only)
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      const video = document.getElementById("video");
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.warn("Camera warning:", err.message);
    });

  // 2. SAVE LOG IMMEDIATELY (do NOT wait for camera)
  saveLog(actionType);
}

function saveLog(actionType) {
  const now = new Date();

  const logData = {
    action: actionType,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  console.log("Saving log:", logData);

  db.collection("logs").add(logData)
    .then(() => {
      document.getElementById("message").innerText =
        actionType + " recorded successfully";

      loadLogs();

      // stop camera after save
      stopCamera();
    })
    .catch(err => {
      console.error("Firestore ERROR:", err);
      alert("Log not saved. Check console.");
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
    })
    .catch(err => {
      console.error("Load logs error:", err);
    });
}

window.onload = loadLogs;
