var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    const fname = './toxa.jpg';
    let jpg = null;

    fs.stat(fname, (err, stat) => {
        if (err)
            console.log('error: ', err)
        else {
            jpg = fs.readFileSync(fname);
            response.writeHead(200, {'Content-Type': 'image/jpeg', 'Content-Length': stat.size});
            response.end(jpg, 'binary');
        }
    })
}).listen(3000);

console.log('Server running at localhost:3000');
