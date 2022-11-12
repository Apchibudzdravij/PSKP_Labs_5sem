const http = require('http');

const options = {
    host: '127.0.0.1',
    path: '/1',
    port: 5000,
    method: 'GET'
}


const req = http.request(options, res => {
    console.log(`Request method:  ${req.method}`);
    console.log(`Status code:     ${res.statusCode}`);
    console.log(`Status message:  ${res.statusMessage}`);
    console.log(`Server IP:       ${res.socket.remoteAddress}`);
    console.log(`Server port:     ${res.socket.remotePort}`);

    let data = '';
    res.on('data', chunk => { console.log(`Response body (data): ${data += chunk.toString('utf8')}`); })
    res.on('end', () => { console.log(`Response body (end):  ${data}\n\n`); });
});

req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
req.end();