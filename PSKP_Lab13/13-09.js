const udp = require('dgram');
const PORT = 4000;
let server = udp.createSocket('udp4');


server.on('message', (msg, info) => {
    console.log(`Server received: ${msg.toString()} (${msg.length} bytes)`);
    server.send(`ECHO: ${msg.toString()}`, info.port, info.address, error => {
        if (error) {
            console.log('[ERROR] ' + error.message);
            server.close();
        }
        else
            console.log('Message sent to client succesfully.');
    })
})

server.on('listening', () => {
    console.log(`\nServer port:  ${server.address().port}`);
    console.log(`IP address:   ${server.address().address}`);
    console.log(`IP family:    ${server.address().family}`);
});

server.on('error', error => {
    console.log('[ERROR] ' + error.message);
    server.close();
});

server.on('close', () => { console.log('Server closed.'); });

server.bind(PORT);