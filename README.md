# 🎥 NPTEL On-Demand Recorded Video Streaming (WebSocket + Real-Time Metrics)

This project simulates an **On-Demand Video Streaming Platform** built using **Node.js**, **Express**, and **WebSockets**.  
The server streams a **recorded video file** (`sample.mp4`) chunk by chunk to the client.  
The client displays **real-time parameters** such as packets received, total data, throughput, progress percentage,  
and live charts — along with a **YouTube-style dual progress bar** (gray for downloaded data, red for playback position).


---

## ⚙️ **Setup Instructions**

### 🧩 Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v14+ recommended)
- npm (comes with Node.js)

---

### 🛠️ **Installation Steps**

1. **Extract the ZIP folder**
   ```bash
   unzip websocket_video_on_demand_realtime_project.zip
   cd websocket_video_on_demand_realtime_project

Place your video file

Rename your video file to sample.mp4

Place it next to server.js

📁 Example:

websocket_video_on_demand_realtime_project/
├── server.js
├── sample.mp4
└── public/
    ├── index.html
    ├── client.js
    └── style.css

npm init -y
npm install express ws
node server.js


▶️ How It Works
🖥️ Server Side (server.js):

Waits for client connection over WebSocket.

Sends total file size info first.

Streams the video file (sample.mp4) in 64 KB chunks.

Sends periodic updates (status) containing:

Packets sent

Bytes transferred

Sends an end signal when streaming is complete.

💻 Client Side (client.js):

Connects to WebSocket.

When the user clicks ▶️ Play Video, it sends a play request.

Starts receiving chunks, accumulating them into a Blob.

Updates real-time parameters:

Packets received

Total data (KB)

Accurate progress (%)

Average throughput (Kbps)

Playback time (seconds)

Displays two bars:

Gray bar → Download progress

Red bar → Playback progress

Generates a live throughput chart (Kbps/sec).

📊 Real-Time Parameters Shown
Parameter	Description
Connection	Current WebSocket connection state
Packets Received	Number of chunks received
Total Data	Data downloaded in KB
Progress	Download completion percentage
Avg Throughput	Average data transfer rate (Kbps)
Playback Time	Current playback time vs total duration
🧠 How the Progress Works

The server sends the total file size before streaming.

Client calculates:

Progress = (BytesReceived / TotalFileSize) * 100


This ensures the progress reaches 100% exactly when download completes.

The playback bar moves independently based on:

Playback = (CurrentTime / Duration) * 100

💡 Technologies Used
Technology	Purpose
Node.js	Backend runtime environment
Express.js	Lightweight server for static files
WebSocket (ws)	Real-time streaming channel
HTML/CSS/JS	Frontend UI and playback logic
Chart.js	Real-time throughput visualization
⚠️ Troubleshooting
Issue	Possible Fix
Video not playing	Ensure sample.mp4 is placed beside server.js
Progress stuck (not accurate)	Restart server (caches file size on startup)
Port already in use	Change port in server.js (e.g., 4000)
Chart not updating	Refresh the page after server restart
🧪 Example Output (Expected)
✅ Server running at http://localhost:3000
📡 New client connected, waiting for play request...
🎬 Client requested to play the video...
✅ Finished sending video


In the browser, you’ll see:

Connection: Downloaded

Packets: Increasing

Throughput chart moving

Gray bar filling → red bar tracking playback

Video playing smoothly 🎥

🚀 Commands Recap
# 1️⃣ Extract project
unzip websocket_video_on_demand_realtime_project.zip
cd websocket_video_on_demand_realtime_project

# 2️⃣ Add your video file
# (rename it as sample.mp4)

# 3️⃣ Install dependencies
npm init -y
npm install express ws

# 4️⃣ Run the server
node server.js

# 5️⃣ Open in browser
http://localhost:3000

🧰 Future Enhancements

Real-time playback during partial download (progressive streaming)

Adaptive bitrate (ABR) support

Multiple clients synchronization

Playback resume / seek support

User analytics dashboard

👨‍💻 Developed for

NPTEL Web Technologies / Networking Systems Lab
Department of Computer Science and Engineering
Vignan’s Foundation for Science, Technology & Research (VFSTR)

© DURGASREE AVVARU