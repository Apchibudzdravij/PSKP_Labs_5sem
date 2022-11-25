const http = require('http');
const fs = require('fs');

const fileName = 'gosling.png';
const fileStream = fs.createWriteStream(fileName);


let options = {
    host: '127.0.0.1',
    path: `/8/image.png`,
    port: 5000,
    method: 'GET'
}



setTimeout(() => {
    const req = http.request(options, (res) => {

        console.log(`\nResponse status:  ${res.statusCode} ${res.statusMessage}`);
        if (res.statusCode != 404) {
            res.pipe(fileStream);
            res.on('end', () => { console.log(`Downloaded file:  ${fileName}\n`); });
        }
    });

    req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
    req.end();
}, 500);


