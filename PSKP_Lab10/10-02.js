const WebSocket = require('ws');
let k = 0;


setTimeout(() => {
    const webSocketClient = new WebSocket('ws:localhost:4000/wsserver', {transports: ['websocket']});
    webSocketClient.on('open', () => {
        console.log('[INFO] Socket opened.');

        intervalSocketSend = setInterval(() => {
            webSocketClient.send('10-02-client: ' + ++k);
        }, 3000);

        webSocketClient.on('message', message => {
            console.log('[Received] ', message.toString());
        })

        setTimeout(() => {
            clearInterval(intervalSocketSend);
            webSocketClient.close(1000, 'Надо для лабы');
        }, 25000);
    })

    webSocketClient.on('error', error => { console.log('[ERROR] WebSocket: ', error.message); })
    console.log(`\n------  WebSocket client  ------\n`);
}, 100);
