const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { scanWifiNetworks } = require('./wifiScanner');
const { startCapture } = require('./pcapScanner');

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

      // Emit an alert if new devices are detected
      if (newDevices.length > 0) {
        console.log('Emitting newDeviceAlert:', newDevices);
        socket.emit('newDeviceAlert', newDevices);
      }
    });
  }, 10000); // Scan every 10 seconds

  // Start capturing packets
  startCapture((packet) => {
    console.log('Emitting packet:', packet);
    socket.emit('packet', packet);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
