//                    C:\\Users\\valda\\AppData\\Roaming\\npm\\node_modules\\secxmail
const send = require('secxmail');
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    send('[06-04] hello from secxmail GLOBAL module!');
    res.end('<h2>Message sucessfully sent.</h2>');
}).listen(5000, () => console.log('Server running at localhost:5000/\n'));