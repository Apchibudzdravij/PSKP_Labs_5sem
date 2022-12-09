const fs = require('fs');
const WebSocket = require('ws');
const path = './upload/downloadedFromClient.txt';


const WebSocketServer = new WebSocket.Server({ port: 4000, host: 'localhost', transports: ['websocket'] });
WebSocketServer.on('connection', ws => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    let wfile = fs.createWriteStream(path);
    duplex.pipe(wfile);
    console.log(`\n[OK] Server – File downloaded to ${path}`);
});
WebSocketServer.on('error', error => {
    console.log('[ERROR] WebSocket: ', error.message);
});