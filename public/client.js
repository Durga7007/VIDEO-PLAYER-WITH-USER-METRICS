const ws = new WebSocket("ws://localhost:3000");
ws.binaryType = "arraybuffer";

let chunks = [];
let totalBytes = 0;
let packets = 0;
let totalFileSize = 1; // Avoid divide by 0
let startTime = null;
let kbpsPerSecond = 0;
let streaming = false;

const connStatus = document.getElementById("connStatus");
const packetsLabel = document.getElementById("packets");
const dataSizeLabel = document.getElementById("dataSize");
const progressLabel = document.getElementById("progress");
const speedLabel = document.createElement("p");
const playbackLabel = document.createElement("p");
document.getElementById("statusBox").appendChild(speedLabel);
document.getElementById("statusBox").appendChild(playbackLabel);

const video = document.getElementById("videoPlayer");
const playBtn = document.getElementById("playBtn");
const ctx = document.getElementById("packetChart").getContext("2d");
const progressBar = document.getElementById("progressFill");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Throughput (Kbps)",
      data: [],
      borderWidth: 2,
      borderColor: "#00ff99"
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { labels: { color: "#fff" } } }
  }
});

// Chart updates every second
setInterval(() => {
  chart.data.labels.push('');
  chart.data.datasets[0].data.push(kbpsPerSecond);
  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
  kbpsPerSecond = 0;
}, 1000);

ws.onopen = () => {
  connStatus.textContent = "Connected";
  connStatus.style.color = "lime";
};

ws.onmessage = (event) => {
  if (typeof event.data === "string") {
    const info = JSON.parse(event.data);

    if (info.type === "init") {
      totalFileSize = info.totalBytes; // Store total file size
    } 
    else if (info.type === "status") {
      packetsLabel.textContent = info.packets;
      dataSizeLabel.textContent = (info.bytes / 1024).toFixed(1) + " KB";

      const progress = ((info.bytes / totalFileSize) * 100).toFixed(1);
      progressLabel.textContent = progress + "%";
      progressBar.style.width = progress + "%";
    } 
    else if (info.type === "end") {
      connStatus.textContent = "Downloaded";
      connStatus.style.color = "cyan";

      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      video.src = url;
      video.play();
      startTime = Date.now();
      streaming = false;
      playBtn.disabled = false;
    }
  } 
  else {
    packets++;
    totalBytes += event.data.byteLength;
    kbpsPerSecond += (event.data.byteLength * 8) / 1024;
    chunks.push(event.data);
  }
};

ws.onclose = () => {
  connStatus.textContent = "Disconnected";
  connStatus.style.color = "red";
};

// Handle play button
playBtn.addEventListener("click", () => {
  if (ws.readyState === WebSocket.OPEN && !streaming) {
    streaming = true;
    playBtn.disabled = true;
    connStatus.textContent = "Streaming...";
    connStatus.style.color = "yellow";
    ws.send("play");
  }
});

// Track video playback time and visual progress
video.addEventListener("timeupdate", () => {
  if (startTime) {
    playbackLabel.textContent = `Playback Time: ${video.currentTime.toFixed(1)}s / ${video.duration ? video.duration.toFixed(1) : "?"}s`;
    const playbackPercent = (video.currentTime / video.duration) * 100;
    document.getElementById("playbackFill").style.width = playbackPercent + "%";
  }
});

// Update average speed
setInterval(() => {
  if (startTime) {
    const elapsed = (Date.now() - startTime) / 1000;
    const speed = ((totalBytes * 8) / 1024 / elapsed).toFixed(2);
    speedLabel.textContent = `Avg Throughput: ${speed} Kbps`;
  }
}, 1000);
