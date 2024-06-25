const arp = require('node-arp');
const os = require('os');

let knownDevices = new Map();
const interval = 60000; // 1 minute interval

function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const iface of Object.values(ifaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal && !alias.mac.startsWith('02:')) {
        // Exclude virtual interfaces and WiFi interfaces (common prefix for WiFi MAC addresses)
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

function scanNetwork(callback) {
  const networkRange = getNetworkRange();
  const newDevices = [];

  networkRange.forEach(ip => {
    arp.getMAC(ip, (err, mac) => {
      if (!err && mac) {
        if (!knownDevices.has(mac)) {
          knownDevices.set(mac, { ip, mac });
          newDevices.push({ ip, mac });
        } else {
          knownDevices.set(mac, { ip, mac });
        }
      }
    });
  });

  callback(newDevices, Array.from(knownDevices.values()));
}

function startMonitoring(callback) {
  setInterval(() => {
    scanNetwork((newDevices, allDevices) => {
      callback(newDevices, allDevices);
    });
  }, interval);
}

module.exports = { startMonitoring };