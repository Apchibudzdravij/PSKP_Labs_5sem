const http = require('http');
const url = require('url');
const server = http.createServer();
const mod = require('./m09')(server);


let http_handler = (req, res) => {
    let pathName = url.parse(req.url).pathname[1];

    if (req.method === 'GET') {
        switch (pathName) {
            case '1': mod.handleStatusAndSocket(req, res); break;
            case '2': mod.handleParametersGet(req, res);   break;
            case '8': mod.handleGetFile(req, res);         break;
            default:  mod.handleDefaultResponse(req, res); break;
        }
    }
    else if (req.method === 'POST') {
        switch (pathName) {
            case '3': mod.handleParametersPost(req, res);  break;
            case '4': mod.handleJson(req, res);            break;
            case '5': mod.handleXml(req, res);             break;
            case '6': mod.handleUploadFile(req, res);      break;
            case '7': mod.handleUploadFile(req, res);      break;
            default:  mod.handleDefaultResponse(req, res); break;
        }
    }
    else {
        res.writeHead(405, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] 405: Incorrect method (Use GET or POST request method)</h1>');
    }
}


server.listen(5000, () => console.log('Server running at localhost:5000/\n'))
    .on('request', http_handler)
    .on('error', e => { console.log('[FATAL] ' + e.code); });