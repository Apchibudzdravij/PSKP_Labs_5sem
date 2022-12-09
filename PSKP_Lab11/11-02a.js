const fs = require('fs');
const WebSocket = require('ws');
const path = `./downloadFromServer.txt`;


setTimeout(() => {
    const ws = new WebSocket('ws://localhost:4000');
    ws.on('open', () => {
        const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
        let wfile = fs.createWriteStream(path);
        duplex.pipe(wfile);
        console.log(`\n[OK] Client – File downloaded to ${path}`);
    });
    ws.on('error', error => {
        console.log('[ERROR] WebSocket: ', error.message);
    });
}, 500);

