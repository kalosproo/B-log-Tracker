let streamRef = null;

function startCamera(actionType) {

  // 1. Start camera (for visual proof only)
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      const video = document.getElementById("video");
        // 👇 ADD THESE LINES
  document.getElementById("cameraPlaceholder").style.display = "none";
  video.style.display = "block";

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
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    const now = new Date();
    const fileName = `logs/${now.getTime()}_${actionType}.jpg`;
    const ref = storage.ref().child(fileName);

    ref.put(blob).then(snapshot => {
      snapshot.ref.getDownloadURL().then(photoURL => {

        const logData = {
          action: actionType,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          photo: photoURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("logs").add(logData).then(() => {
          document.getElementById("message").innerText =
            actionType + " + photo saved";

          loadLogs();
          stopCamera(); // ✅ ONLY ONCE
        });

      });
    });
  }, "image/jpeg");
}


    })
    .catch(err => {
      console.error("Firestore ERROR:", err);
      alert("Log not saved. Check console.");
    });
}

function stopCamera() {
  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
    document.getElementById("video").style.display = "none";
document.getElementById("cameraPlaceholder").style.display = "flex";

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
