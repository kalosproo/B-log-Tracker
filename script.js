let actionType = "";

function startCamera(type) {
  actionType = type;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById("video").srcObject = stream;
      setTimeout(saveLog, 2000);
    });
}

function saveLog() {
  const now = new Date();

  db.collection("logs").add({
    action: actionType,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById("log").innerText =
      `${actionType} saved successfully`;
  })
  .catch(error => {
    console.error("Error saving log:", error);
  });
}
