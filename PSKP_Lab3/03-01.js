var http = require('http');
global.state = 'test';
global.oldState = 'test';


http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<html><body><h1>' + state + '</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000'));


var stdin = process.openStdin();
stdin.addListener('data', function (cmd) 
{
    var arg = cmd.toString().trim();
    if (arg === 'norm' || arg === 'test' || arg === 'stop' || arg === 'idle') 
    {
        oldState = state;
        state = cmd.toString().trim();
        console.log(oldState + ' --> ' + state);
    }
    else if (cmd.toString().trim() === 'exit') 
        process.exit(0);
    else 
        console.log('Enter one of the commands: norm, stop, test, idle or exit');
});