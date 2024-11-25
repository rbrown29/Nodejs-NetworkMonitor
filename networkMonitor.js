const ping = require('net-ping');
const os = require('os');
const arp = require('node-arp');

const session = ping.createSession();
let knownDevices = new Map();
const interval = 20000; // 20 seconds

function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const iface of Object.values(ifaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal && !alias.mac.startsWith('02:')) {
        return alias.address;
      }
    }
  }
}

function getNetworkRange() {
  const localIP = getLocalIP();
  const subnet = localIP.substring(0, localIP.lastIndexOf('.') + 1);
  const range = [];
  for (let i = 1; i <= 254; i++) {
    range.push(subnet + i);
  }
  return range;
}

function getDeviceInfo(ip, callback) {
  arp.getMAC(ip, (err, mac) => {
    callback({ ip, mac: err ? null : mac });
  });
}

function scanNetwork(callback) {
  const networkRange = getNetworkRange();
  const newDevices = [];
  let completedRequests = 0;

  networkRange.forEach(ip => {
    session.pingHost(ip, (error, target) => {
      completedRequests++;
      if (!error) {
        getDeviceInfo(target, (device) => {
          if (!knownDevices.has(device.mac)) {
            knownDevices.set(device.mac, device);
            newDevices.push(device);
          } else {
            knownDevices.set(device.mac, device);
          }
          // When all requests are completed, call the callback
          if (completedRequests === networkRange.length) {
            callback(newDevices, Array.from(knownDevices.values()));
          }
        });
      } else {
        if (completedRequests === networkRange.length) {
          callback(newDevices, Array.from(knownDevices.values()));
        }
      }
    });
  });
}

function startMonitoring(callback) {
  // Initial scan
  scanNetwork((newDevices, allDevices) => {
    callback(newDevices, allDevices);
  });

  // Periodic scan
  setInterval(() => {
    scanNetwork((newDevices, allDevices) => {
      callback(newDevices, allDevices);
    });
  }, interval);
}

module.exports = { startMonitoring };
