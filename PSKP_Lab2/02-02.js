var http = require('http');
var fs = require('fs');
const route = 'png';

http.createServer(function (request, response) {
    console.log(request.url);

    if (request.url === '/' + route)
    {
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
    }
    else
        response.end('<html><body><h1>Error! Visit localhost:5000/' + route + '</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000/' + route));
