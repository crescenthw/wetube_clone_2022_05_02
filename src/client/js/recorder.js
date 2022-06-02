const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  video.srcObject = stream;
  //   video.play();
};

const handleStartRecord = () => {
  video.play();
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStartRecord);
  startBtn.addEventListener("click", handleStopRecord);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.play();
  };
  recorder.start();
  //   setTimeout(() => {
  //     recorder.stop();
  //   }, 6 * 1000);
};

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecordingFile.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStopRecord = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStopRecord);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

init();
startBtn.addEventListener("click", handleStartRecord);
