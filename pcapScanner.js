// pcapScanner.js
const pcap = require('pcap-parser');

function startCapture(callback) {
  const parser = pcap.parse('./test.pcap'); // Ensure the path is correct

  parser.on('packet', (packet) => {
    try {
      console.log('Received packet:', packet);
      // Extract meaningful data from the packet for display
      const packetData = {
        channel: packet.channel || 1,
        frequency: packet.frequency || 2412,
        signal_level: packet.signal_level || '-18',
        quality: packet.quality || 164,
        security: packet.security || 'RSN',
        security_flags: packet.security_flags || ['(PSK/AES/AES)']
      };
      console.log('Processed packet data:', packetData);
      callback(packetData);
    } catch (err) {
      console.error('Error processing packet:', err);
    }
  });

  parser.on('end', () => {
    console.log('Finished parsing the pcap file.');
  });

  parser.on('error', (err) => {
    console.error('Error parsing the pcap file:', err);
  });
}

module.exports = { startCapture };