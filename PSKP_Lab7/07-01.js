const http = require('http');
const url = require('url');
const fs = require('fs');
const mod = require('./m07-01')('./static');


let http_handler = (req, res) => {
    if (req.method === 'GET') {
        if (mod.isStatic('html', req.url)) mod.sendFile(req, res, { 'Content-Type': 'text/html; charset=utf-8' });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    }
    else {
        console.log('405 statuscode');
        response.statusCode = 405;
        response.statusMessage = 'Incorrect method';
        response.end("[ERROR] 405 – Incorrect method. Use GET");
    }
}


let server = http.createServer();

server.listen(5000, () => console.log('Server running at localhost:5000/\n'))
    .on('request', http_handler)
    .on('error', e => { console.log('[ERROR] ' + e.code) });