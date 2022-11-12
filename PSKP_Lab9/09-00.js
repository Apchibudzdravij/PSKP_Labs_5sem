const http = require('http');
const url = require('url');
const server = http.createServer();
const mod = require('./m09')(server);


let http_handler = (req, res) => {
    let pathName = url.parse(req.url).pathname;


    if (req.method === 'GET') {
        switch (pathName) {
            case '/1': mod.handleStatusAndSocket(req, res); break;
            case '/2': mod.handleParametersGet(req, res);   break;
        }
    }
    else if (req.method === 'POST') {
        switch (pathName) {
            case '/3': mod.handleParametersPost(req, res);  break;
            case '/4': mod.handleJson(req, res);            break;
            case '/5': mod.handleXml(req, res);             break;
            case '/6': mod.handleTextFile(req, res);        break;
        }
    }
}




server.listen(5000, () => console.log('Server running at localhost:5000/\n'))
    .on('request', http_handler)
    .on('error', e => { console.log('[FATAL] ' + e.code); });