const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const { scanWifiNetworks } = require("./wifiScanner");
const { startMonitoring } = require("./networkMonitor");
const { startCapture } = require("./pcapCapture");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/packets", (req, res) => {
  res.sendFile(path.join(__dirname, "packets.html"));
});

app.get("/wifi", (req, res) => {
  res.sendFile(path.join(__dirname, "wifi.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Start WiFi scan when requested
  socket.on("startWifiScan", () => {
    console.log("Starting WiFi scan...");
    scanWifiNetworks((networks, newDevices) => {
      socket.emit("wifiScanResults", networks);
      socket.emit("newWiFiDeviceAlert", newDevices);
    });
    // Start periodic WiFi scan
    setInterval(() => {
      scanWifiNetworks((networks, newDevices) => {
        socket.emit("newWiFiDeviceAlert", newDevices);
        socket.emit("wifiScanResults", networks);
      });
    }, 10000); // Send time to client every 10 seconds
  });

  // Start packet capture when requested
  socket.on("startPacketCapture", () => {
    console.log("Starting packet capture...");
    startCapture((packet) => {
      socket.emit("packet", packet);
    });
  });

  // Start local network monitoring when requested
  socket.on("startLocalNetworkMonitoring", () => {
    console.log("Starting local network monitoring...");
    startMonitoring((newDevices, allDevices) => {
      socket.emit("newLocalDeviceAlert", newDevices);
      socket.emit("allLocalDevices", allDevices);
    });
  });
  // Start periodic local network monitoring
  setInterval(() => {
    startMonitoring((newDevices, allDevices) => {
      socket.emit("newLocalDeviceAlert", newDevices);
      socket.emit("allLocalDevices", allDevices);
    });
  }, 300000); // scan every 5 minutes
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
