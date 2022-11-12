const http = require('http');

const jsonObject = JSON.stringify({
    '__comment': 'req: lab 09',
    x: 3,
    y: 2,
    s: 'Гей',
    m: ['1', 'qq', 'qwe'],
    o: { surname: 'Димитриади', name: 'Антон' }
});


const options = {
    host: '127.0.0.1',
    path: `/4`,
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}


const req = http.request(options, res => {
    let data = '';
    console.log(`Response status:  ${res.statusCode} ${res.statusMessage}`);
    res.on('data', chunk => { data += chunk.toString('utf8'); })
    res.on('end', () => { console.log(`Response body (end):\n${data}\n\n`); });
});

req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
req.end(jsonObject);