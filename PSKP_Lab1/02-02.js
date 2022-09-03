var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    let html = fs.readFileSync('./02-03.html');
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(html);
}).listen(3000);

console.log('Server running at localhost:3000');
