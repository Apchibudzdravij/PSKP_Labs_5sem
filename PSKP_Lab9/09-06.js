const http = require('http');
const fs = require('fs');

let bound = 'qweqweqwe';
let body = `--${bound}\r\n`;
body += 'Content-Disposition: form-data; name="fileUpload"; filename="MyFile.txt"\r\n';
body += 'Content-Type: text/plain\r\n\r\n';
body += fs.readFileSync('./MyFile.txt');
body += `\r\n--${bound}--`;


let options = {
    host: '127.0.0.1',
    path: '/6',
    port: 5000,
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${bound}` }
}


setTimeout(() => {
    const req = http.request(options, (res) => {
        let data = '';

        console.log(`\nResponse status: ${res.statusCode} ${res.statusMessage}\n`);
        console.log('------------------------------------------------------------------------\n');
        res.on('data', chunk => { console.log(`Response body (data): ${data += chunk.toString('utf8')}`); });

        res.on('end', () => {
            console.log('\n------------------------------------------------------------------------\n');
            console.log(`Response body (end): ${data}\n`);
        });
    });

    req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
    req.end(body);
}, 500);
