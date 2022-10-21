import http from 'http';

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (url.parse(request.url).pathname === '/')
        response.end('<h1>я люблю сашу потому что он мой папочка а ещё он держит меня в заложниках</h1>');
    if (url.parse(request.url).pathname === '/daddy')
        
}).listen(5000);