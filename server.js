const express = require('express');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.static('public'));

const server = app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log("📡 New client connected, waiting for play request...");

  ws.on('message', (msg) => {
    const message = msg.toString();
    if (message === 'play') {
      console.log("🎬 Client requested to play the video...");

      const videoPath = path.join(__dirname, 'sample.mp4');
      const stats = fs.statSync(videoPath);         // Get file size
      const totalSize = stats.size;                 // Total bytes in the video file

      // Send initialization message with total file size
      ws.send(JSON.stringify({
        type: 'init',
        totalBytes: totalSize
      }));

      const stream = fs.createReadStream(videoPath, { highWaterMark: 64 * 1024 });

      let sentPackets = 0;
      let totalBytes = 0;

      stream.on('data', (chunk) => {
        sentPackets++;
        totalBytes += chunk.length;
        ws.send(chunk);

        // Send status update every 10 packets
        if (sentPackets % 10 === 0) {
          ws.send(JSON.stringify({
            type: 'status',
            packets: sentPackets,
            bytes: totalBytes
          }));
        }
      });

      stream.on('end', () => {
        console.log("✅ Finished sending video");
        ws.send(JSON.stringify({ type: 'end' }));
      });

      ws.on('close', () => {
        console.log("❌ Client disconnected");
        stream.destroy();
      });
    }
  });
});
