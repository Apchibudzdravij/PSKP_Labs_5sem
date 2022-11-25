const http = require('http');
const url = require('url');
const fs = require('fs');
const WebSocket = require('ws');



// =======================================   HTTP SERVER   =======================================

const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET' && url.parse(req.url).pathname === '/start') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync('./start.html'));
    }
    else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] Visit localhost:3000/start using GET method. </h1>');
    }
});

httpServer.listen(3000, () => console.log('--------  HTTP server  --------- \n    Running at localhost:3000\n'))
    .on('error', e => { console.log('[FATAL] ' + e.code); })






// ====================================   WEBSOCKET SERVER   ====================================

let k = 0;
let n = 0;


const webSocketServer = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' }, {transports: ['websocket']});
webSocketServer.on('connection', ws => {
    console.log('[INFO] Client connected.');
    ws.on('message', message => {
        console.log(`[Received]  ${message}`);
        n = +message.toString().slice(-1);
    })
    setInterval(() => {
        ws.send(`10-01-server: ${n}->${++k}`);
    }, 5000);
})

webSocketServer.on('error', error => { console.log('[ERROR] WebSocket: ', error.message); })
console.log(`------  WebSocket server  ------\n\tHost: ${webSocketServer.options.host}\n\t` +
    `Path: ${webSocketServer.options.path}\n\t   Port: ${webSocketServer.options.port}\n`);