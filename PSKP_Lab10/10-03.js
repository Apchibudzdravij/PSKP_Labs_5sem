const WebSocket = require('ws');


const webSocketBroadcastServer = new WebSocket.Server({ port: 5000, host: 'localhost', path: '/broadcast' }, { transports: ['websocket'] });
webSocketBroadcastServer.on('connection', ws => {
    console.log('[INFO] Socket opened.');

    ws.on('message', message => {
        // console.log(`[Received]  ${message}`);
        webSocketBroadcastServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Server: ' + message);
            }
        });
    })

    ws.on('close', () => {
        console.log('[INFO] Socket has been closed.');
    })
})


webSocketBroadcastServer.on('error', error => { console.log('[ERROR] WebSocket: ', error.message); })
console.log(`-------  Broadcast server  -------\n\t Host: ${webSocketBroadcastServer.options.host}\n\t` +
    `Path: ${webSocketBroadcastServer.options.path}\n\t   Port: ${webSocketBroadcastServer.options.port}\n`);