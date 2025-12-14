let actionType = "";

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// Load saved theme
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

function startCamera(type) {
  actionType = type;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById("video").srcObject = stream;
      setTimeout(capturePhoto, 2000);
    });
}

function capturePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const time = new Date().toLocaleString();
  document.getElementById("log").innerText =
    `${actionType} recorded at ${time}`;
}
