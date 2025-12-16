let actionType = "";
let streamRef = null;
let cameraReady = false;

function startCamera(type) {
  actionType = type;
  cameraReady = false;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      streamRef = stream;
      const video = document.getElementById("video");
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        cameraReady = true;
        saveLog(); // save ONLY after camera is really ready
      };
    })
    .catch(err => {
      alert("Camera error: " + err.message);
    });
}

function saveLog() {
  if (!cameraReady) return;

  // stop camera AFTER capture moment
  setTimeout(() => {
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
    }
  }, 500);

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
    })
    .catch(err => {
      alert("Firestore error: " + err.message);
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

      if (snapshot.empty) {
        list.innerHTML = "<p style='color:#9ca3af'>No logs yet</p>";
        return;
      }

      snapshot.forEach(doc => {
