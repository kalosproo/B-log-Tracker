let streamRef = null;

function startCamera(actionType) {

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      const video = document.getElementById("video");

      document.getElementById("cameraPlaceholder").style.display = "none";
      video.style.display = "block";

      video.srcObject = stream;
      video.play();

      // Save log immediately (no dependency on camera)
      saveLog(actionType);
    })
    .catch(err => {
      console.warn("Camera warning:", err.message);
      saveLog(actionType); // still log even if camera fails
    });
}

function saveLog(actionType) {
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

      loadLogs();
      stopCamera();
    })
    .catch(err => {
      console.error("Firestore error:", err);
      alert("Log not saved");
    });
}

function stopCamera() {
  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
    streamRef = null;
  }

  document.getElementById("video").style.display = "none";
  document.getElementById("cameraPlaceholder").style.display = "flex";
}

function loadLogs() {
  db.collection("logs")
    .orderBy("createdAt", "desc")
    .limit(20)
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
