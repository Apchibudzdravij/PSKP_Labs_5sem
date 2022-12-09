const fs = require('fs');
const WebSocket = require('ws');
const path = `./sendToServer.txt`;


setTimeout(() => {
    const ws = new WebSocket('ws://localhost:4000');
    ws.on('open', () => {
        const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
        let rfile = fs.createReadStream(path);
        rfile.pipe(duplex);
        console.log(`\n[OK] Client – File sent from ${path}`);
    });
    ws.on('error', error => {
        console.log('[ERROR] WebSocket: ', error.message);
    });
}, 500);

