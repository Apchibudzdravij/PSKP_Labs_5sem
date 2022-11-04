const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');
let server = http.createServer();
const mod = require('./m08')(server);



let http_handler = (req, res) => {
    if (req.method === 'GET') {
        if (url.parse(req.url).pathname != '/favicon.ico') {
            // console.log('\n0 = ' + url.parse(req.url).pathname.split('/')[0]);
            console.log('\n' + url.parse(req.url).pathname.split('/')[1]);
            // console.log('2 = ' + url.parse(req.url).pathname.split('/')[2]);
            // console.log('3 = ' + url.parse(req.url).pathname.split('/')[3]);
        }


        switch (url.parse(req.url).pathname.split('/')[1]) {
            case 'connection':  mod.handleConnection(req, res); break;
            case 'headers':     mod.handleHeaders(req, res); break;
            case 'parameter':   mod.handleParameter(req, res); break;
            case 'close':       mod.handleClose(req, res); break;
            case 'socket':      mod.handleSocket(req, res); break;
            case 'req-data':    mod.handleReqData(req, res); break;
            case 'resp-status': mod.handleRespStatus(req, res); break;
            case 'files':       mod.handleFiles(req, res); break;
            case 'upload':      mod.handleUpload(req, res); break;
            case '': console.log('ebat'); res.end('main page'); break;
            default: res.end('ty dolbaeb?'); break;
        }
    }
    else if (req.method === 'POST') {
        switch (req.url) {
            case '/formparameter': console.log(req.url); break;
            case '/json': console.log(req.url); break;
            case '/xml': console.log(req.url); break;
            case '/upload': console.log(req.url); break;
            case '': console.log('ebat'); res.end('main page'); break;
            default: res.end('ty dolbaeb?'); break;
        }
    }
    else { }
}





server.listen(5000, () => console.log('Server running at localhost:5000/\n'))
    .on('request', http_handler)
    .on('error', e => { console.log('[FATAL] ' + e.code) });