const WebSocket = require('ws');
let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'A' : parm;
console.log(`\nparm = ${parm}`);
console.log(`prfx = ${prfx}`);


setTimeout(() => {
    let WebSocketBroadcastClient = new WebSocket('ws://localhost:5000/broadcast');
    let intervalSocketSend;

    WebSocketBroadcastClient.on('open', () => {
        console.log('[INFO] Socket opened.');
        let k = 0;

        intervalSocketSend = setInterval(() => {
            WebSocketBroadcastClient.send(`Client: ${prfx}-${++k}`);
        }, 1000);

        WebSocketBroadcastClient.on('message', message => {
            console.log('[Received]: ', message.toString());
        })

        setTimeout(() => {
            clearInterval(intervalSocketSend);
            WebSocketBroadcastClient.close();
        }, 25000);
    })


    WebSocketBroadcastClient.on('error', error => { console.log('[ERROR] WebSocket: ', error.message); })
    console.log(`\n------  Broadcast client  ------\n`);
}, 100);
