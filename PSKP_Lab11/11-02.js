const fs = require('fs');
const WebSocket = require('ws');
const path = './download/sendToClient.txt';

const WebSocketServer = new WebSocket.Server({ port: 4000, host: 'localhost', transports: ['websocket'] });
WebSocketServer.on('connection', ws => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    let rfile = fs.createReadStream(path);
    rfile.pipe(duplex);
    console.log(`\n[OK] Server – File sent from ${path}`);
});
WebSocketServer.on('error', error => {
    console.log('[ERROR] WebSocket: ', error.message);
});