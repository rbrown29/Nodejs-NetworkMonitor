// wifiScanner.js
const wifi = require('node-wifi');

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

let knownDevices = new Set();

function scanWifiNetworks(callback) {
  wifi.scan((err, networks) => {
    if (err) {
      console.error(err);
    } else {
      const newDevices = [];
      networks.forEach(network => {
        if (!knownDevices.has(network.bssid)) {
          knownDevices.add(network.bssid);
          newDevices.push({
            mac: network.mac || '',
            bssid: network.bssid || '',
            ssid: network.ssid || '',
            channel: network.channel || 1,
            frequency: network.frequency || 2412,
            signal_level: network.signal_level || '-18',
            quality: network.quality || 164,
            security: network.security || 'RSN',
            security_flags: network.security_flags || ['(PSK/AES/AES)']
          });
        }
      });
      callback(networks, newDevices);
    }
  });
}

module.exports = { scanWifiNetworks };