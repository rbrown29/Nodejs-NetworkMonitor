const pcap = require('pcap');
const pcapSession = pcap.createSession('', 'ip');

function startCapture(callback) {
  pcapSession.on('packet', (rawPacket) => {
    const packet = pcap.decode.packet(rawPacket);
    const ethernet = packet.payload;
    const ip = ethernet.payload;
    let packetInfo = {};

    if (ip && ip.saddr && ip.daddr) {
      const tcp = ip.payload;

      packetInfo = {
        srcIp: ip.saddr.addr.join('.'),
        dstIp: ip.daddr.addr.join('.'),
        protocol: ip.protocol_name
      };

      if (tcp && tcp.sport && tcp.dport) {
        packetInfo.srcPort = tcp.sport;
        packetInfo.dstPort = tcp.dport;
      }
    }

    callback(packetInfo);
  });
}

module.exports = { startCapture };


