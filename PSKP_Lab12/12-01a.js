const WebSocket = require('ws');
// const rpcClient = require('rpc-websockets').Client;


setTimeout(() => {
    // let ws = new rpcClient('ws://localhost:3000');

    const ws = new WebSocket('ws://localhost:4000/');

    ws.on('open', () => {
        console.log('\nSocket opened.');

        ws.on('message', message => {
            console.log('[INFO]', message.toString());
        })

        // ws.subscribe('A');
        // ws.on('A', data => { console.log('on A:', data.toString()) })
    })

    ws.on('close', () => { console.log('Socket closed.'); });

    ws.on('error', error => { console.log('[ERROR]: ', error.message); });

}, 100);
