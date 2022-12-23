const http = require('http');
const get_handler = require('./get_handler');
let server = http.createServer();


let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET': get_handler(req, res); break;
    }
}



server.listen(5000, () => { console.log('\n[INFO] Server running at localhost:5000/'); })
    .on('error', error => { console.log('\n[ERROR] ', error.message); })
    .on('request', http_handler);