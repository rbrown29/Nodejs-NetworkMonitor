# :dragon: <green>NodeJS Network Monitor<green/>

### Author and Code design by Richard Brown

### Links To Gitub project. :link:

- https://github.com/rbrown29/Nodejs-NetworkMonitor

### Description

Nodejs-NetworkMonitor is a Node.js application that monitors local network traffic in real-time. It captures and displays information about your local network, Newly detected devices on the WiFi and local network, and network packets. The application uses several technologies including pcap for packet capture, node-arp for ARP scanning, and Socket.IO for real-time updates to the frontend.

### Features

- WiFi Network Scanning: Detects and displays available WiFi networks, including SSID, signal strength, and security details.
- New Device Alerts: Sends real-time alerts when new devices are detected on the WiFi or local network.
- Packet Capturing: Captures network packets and displays key details such as source and destination IP addresses, ports,and protocols.
- Local Network Monitoring: Lists all devices on the local network with their IP and MAC addresses.
- Real-Time Updates: Uses Socket.IO to send real-time updates to the frontend when new devices are detected or packets are captured.

### Key Concepts

1. _Event-Driven Architecture:_
   - The server listens for specific events (startWifiScan, startPacketCapture, startLocalNetworkMonitoring) and starts the respective processes only when requested by the client.
2. _Efficient Resource Usage:_
   - By starting scans and monitoring processes only when needed, this setup conserves server resources and avoids unnecessary processing.
3. _Real-Time Updates:_
   - The client receives real-time updates as data becomes available.
4. _Error Handling:_
   - Ensure that any errors during scans or monitoring are properly handled and communicated to the client if necessary.

### Technologies

- <green>Node.js<green/>
- <purple>Express<purple/>
- <red>Socket.IO<red/>
- <yellow>Pcap<yellow>
- <blue>Node-arp<blue/>
- <black>Mode-Wifi</black>
- <green>Net-ping</green>
- <purple>HTML/CSS<purple/>
- <red>JavaScript<red/>
- <green>Nodemon<green/>

### Installation

```
git clone https://github.com/rbrown29/Nodejs-NetworkMonitor
cd Nodejs-NetworkMonitor
npm install
```

### Usage

```
npm start
or
npm run dev (for development - uses nodemon)
```

### Requirements

- Node.js
- npm
- Elevated privileges for network scanning and packet capturing

### <red>_Notes_<red/> :warning:

Use this tool <red>responsibly<red/><black> and only on<black/> <red>networks you own<red/><black> or have <black/><red>permission to monitor.<red/><red/> <black>Unauthorized<black/> <red>network scanning and packet capturing may be illegal<red/><black> in some regions.<black/>
