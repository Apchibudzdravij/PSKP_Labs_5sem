var http = require('http');

http.createServer(function(request, response) {
    console.log(request.url);

    if (request.url === '/api/name')
    {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Валдайцев Александр Денисович')
    }
    else
        response.end('<html><body><h1>Error! Visit localhost:5000/api/name</h1></body></html>')
}).listen(5000, () => console.log('Server running at localhost:5000/api/name'));