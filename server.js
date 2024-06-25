const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { scanWifiNetworks } = require('./wifiScanner');
const { startCapture } = require('./pcapScanner');
const { startMonitoring } = require('./networkMonitor');

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

  // Start capturing packets
  startCapture((packet) => {
    console.log('Emitting packet:', packet);
    socket.emit('packet', packet);
  });

  // Monitor the local network for new devices and all devices
  startMonitoring((newDevices, allDevices) => {
    if (newDevices.length > 0) {
      console.log('New local network devices detected:', newDevices);
    }
    console.log('All local network devices:', allDevices);
    socket.emit('newLocalDeviceAlert', newDevices);
    socket.emit('allLocalDevices', allDevices);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


