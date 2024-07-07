const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { scanWifiNetworks } = require('./wifiScanner');
const { startMonitoring } = require('./networkMonitor');
const { startCapture } = require('./pcapCapture'); // Import the new pcapCapture module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Periodically scan WiFi networks and emit results
  setInterval(() => {
    scanWifiNetworks((networks, newDevices) => {
      socket.emit('wifiScanResults', networks);

      // Emit an alert if new WiFi devices are detected
      if (newDevices.length > 0) {
        console.log('Emitting newWiFiDeviceAlert:', newDevices);
        socket.emit('newWiFiDeviceAlert', newDevices);
      }
    });
  }, 10000); // Scan every 10 seconds

  // Monitor the local network for new devices and all devices
  startMonitoring((newDevices, allDevices) => {
    if (newDevices.length > 0) {
      console.log('New local network devices detected:', newDevices);
    }
    console.log('All local network devices:', allDevices);
    socket.emit('newLocalDeviceAlert', newDevices);
    socket.emit('allLocalDevices', allDevices);
  });

  // Start capturing packets
  startCapture((packet) => {
    if (packet.srcIp && packet.dstIp) {
      socket.emit('packet', packet);
    }
  });
});

server.listen(3000, () => {
  console.log('http://localhost:3000/');
});

