const net = require('net');
const HOST = '0.0.0.0';
const PORT = 4000;


net.createServer(socket => {
    console.log(`\nClient connected: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', data => {
        console.log(`Server data: ${data}`);
        if (!socket._destroy) {
            socket.write(`ECHO: ${data}`);
            socket.destroy();
        }
    })

    socket.on('close', () => { console.log(`Connection closed.`); })
    socket.on('error', error => { console.log('[ERROR] Client: ' + error.message); });
}).listen(PORT, HOST);


server.on('error', error => { console.log('[ERROR] Server: ' + error.message); });