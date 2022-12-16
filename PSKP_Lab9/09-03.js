const http = require('http');
const qs = require('qs');
const parameters = qs.stringify({ x: 3, y: 4, s: 'hello' });

const options = {
    host: '127.0.0.1',
    path: `/3`,
    port: 5000,
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
}

setTimeout(() => {
    const req = http.request(options, res => {
        let data = '';
        console.log(`Response status:       ${res.statusCode} ${res.statusMessage}`);
        res.on('data', chunk => { console.log(`Response body (data):  ${data += chunk.toString('utf8')}`); })
        res.on('end', () => { console.log(`Response body (end):   ${data}\n\n`); });
    });

    req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
    req.write(parameters);
    req.end();
}, 500);
