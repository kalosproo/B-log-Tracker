let actionType = "";

function startCamera(type) {
  actionType = type;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById("video").srcObject = stream;
      setTimeout(capturePhoto, 3000);
    });
}

function capturePhoto() {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  let time = new Date().toLocaleString();
  document.getElementById("log").innerText =
    actionType + " recorded at " + time;
}
