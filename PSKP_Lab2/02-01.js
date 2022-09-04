var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    console.log(request.url);

    if (request.url === '/html')
    {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else
        response.end('<html><body><h1>Error! Visit localhost:5000/html</h1></body></html>')
}).listen(5000, () => console.log('Server running at localhost:5000/html'));
