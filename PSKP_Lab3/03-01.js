var http = require('http');
global.state = 'test';      // глобальные объекты, чтобы их было видно и в stdin, и в createServer
global.oldState = 'test';


http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<html><body><h1>' + state + '</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000'));


var stdin = process.openStdin();
stdin.addListener('data', (cmd) =>
{
    var arg = cmd.toString().trim();    // toString().trim() чтобы убрать лишние пробелы в считываемой строке:
    // то что мы вводим в командную строку, считывается как буфер, поэтому мы сначала преобразовываем это
    // в строку через toString(), а потом убираем лишнию пробелы\энтеры\табуляцию через trim()
    if (arg === 'norm' || arg === 'test' || arg === 'stop' || arg === 'idle') 
    {
        oldState = state;
        state = arg;
        process.stdout.write(oldState + ' --> ' + state + '\n');
    }
    else if (cmd.toString().trim() === 'exit') 
        process.exit(0);
    else
        process.stdout.write('Enter one of the commands: norm, stop, test, idle or exit\n');
});