const { createServer } = require('http');
const net = require('net');
const HOST = '0.0.0.0';
const PORT_4000 = 4000;
const PORT_5000 = 5000;
let sum = 0;
let label = (pfx, port, socket) => { return `${pfx} ${socket.remoteAddress}: ${socket.remotePort} -> `; }
let connections = new Map();

let socketHandler = port => {
    return socket => {
        console.log(`[${port}] Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

        socket.on('data', data => {
            sum += data.readInt32LE();
            console.log(`[${port}] Server received from client: `, data, `sum = ${sum}`);
        })

        let buf = Buffer.alloc(4);
        setTimeout(() => {
            setInterval(() => {
                buf.writeInt32LE(sum, 0);
                socket.write(buf);
            }, 5000);
        }, 500);

        socket.on('close', () => { console.log(`[${port}] Connection closed.`); })
        socket.on('error', error => { console.log(`[ERROR] Client - ${port}: ${error.message}`); });
    }
}



net.createServer(socketHandler(PORT_4000))
    .listen(PORT_4000, HOST)
    .on('listening', () => { console.log(`\nStarted server: ${HOST}:${PORT_4000}`) });


net.createServer(socketHandler(PORT_5000))
    .listen(PORT_5000, HOST)
    .on('listening', () => { console.log(`Started server: ${HOST}:${PORT_5000}\n`) });