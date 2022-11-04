const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');



function StaticHandler(server) {
    this.server = server;
    let regexNumber = new RegExp('^[0-9]+$');


    this.handleConnection = (req, res) => {
        let setParameter = url.parse(req.url, true).query.set;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        if (!setParameter) {
            console.log('no params: ' + setParameter);
            res.end(`<h1>[INFO] KeepAliveTimeout = ${this.server.keepAliveTimeout}</h1>`);
        }

        else if (regexNumber.test(setParameter)) {
            console.log('params: ' + setParameter);
            this.server.keepAliveTimeout = +url.parse(req.url, true).query.set;
            res.end(`<h1>[OK] New KeepAliveTimeout = ${this.server.keepAliveTimeout}</h1>`);
        }

        else {
            res.end(`<h1>[FATAL] Enter correct keepAliveTimeout. </br>Your value: ${setParameter}</h1>`);
        }
    }





    this.handleParameter = (req, res) => {
        let xQuery = url.parse(req.url, true).query.x;
        let yQuery = url.parse(req.url, true).query.y;
        let xRoute = url.parse(req.url).pathname.split('/')[2];
        let yRoute = url.parse(req.url).pathname.split('/')[3];
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        console.log('x = ' + xQuery + '; y = ' + yQuery);

        // если параметры указаны в query
        if (regexNumber.test(xQuery) && regexNumber.test(yQuery)) {
            res.end(`<h1>
                        x = ${xQuery}; y = ${yQuery} <br/>
                        x + y = ${+xQuery + +yQuery} <br/>
                        x - y = ${xQuery - yQuery} <br/>
                        x * y = ${xQuery * yQuery} <br/>
                        x / y = ${xQuery / yQuery}
                    </h1>`);
        }

        // если параметры указаны в URI 
        else if (xRoute != 'undefined' && yRoute != 'undefined') {
            if (regexNumber.test(xRoute) && regexNumber.test(yRoute)) {
                res.end(`<h1>
                        x = ${xRoute}; y = ${yRoute} <br/>
                        x + y = ${+xRoute + +yRoute} <br/>
                        x - y = ${xRoute - yRoute} <br/>
                        x * y = ${xRoute * yRoute} <br/>
                        x / y = ${xRoute / yRoute}
                    </h1>`);
            }
            // если нечисловые параметры в URI
            else {
                res.end(`<h1>[ERROR] Enter correct x and y parameters in URI. 
                <br/>Your value: x = ${xRoute}, y = ${yRoute}
                </h1>`);
            }
        }

        // если параметров няма
        else {
            res.end(`<h1>[ERROR] Enter correct x and y parameters in query. 
                    <br/>Your value: x = ${xQuery}, y = ${yQuery}
                    </h1>`);
        }
    }





    this.handleClose = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        console.log('The server will disconnect in 10 seconds.');
        setTimeout(() => {
            console.log('Server disconnected.');
            this.server.close();
            // process.exit(0);
        }, 1000);
        res.end('<h1>The server will disconnect in 10 seconds.</h1>');
    }





    this.handleSocket = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>
                    Client port: ${res.socket.localPort} <br/>
                    Client ip: ${res.socket.localAddress} <br/>
                    Server port: ${res.socket.remotePort} <br/>
                    Server ip: ${res.socket.remoteAddress} <br/>
                </h1>`);
    }





    this.handleFiles = (req, res) => {
        let filename = url.parse(req.url).pathname.split('/')[2];

        // если нет имени файла в URI, выводится кол-во файлов
        if (filename === undefined) {
            fs.readdir('./static', (err, files) => {
                if (err) {
                    res.end('<h1>[FATAL] Did not find ./static directory<h1>');
                    return;
                }
                res.setHeader('X-static-files-count', `${files.length}`);
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>[OK] Count of files in ./static directory: ${files.length}. 
                        <br/>[INFO] Also check headers (F12 –> Network)</h1>`);
            });
        }

        // если есть имя файла в URI, то пересылаем
        else {
            try {
                res.end(fs.readFileSync(`static/${filename}`));
            }
            catch (err) {
                res.writeHead(404, 'Resource not found', { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>[ERROR] 404: Resource not found.</h1>')
            }
        }
    }





    this.handleHeaders = (req, res) => {
        let i = 0;
        let result = '<h1>Заголовки запроса:</h1>';
        for (key in req.headers) {
            result += `${++i}. ${key}: ${req.headers[key]}<br/>`;
        }

        i = 0;
        result += '<br/><h1>Заголовки ответа:</h1>';
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Gay-List', 'Anton Dimitriadi; Vlad Gud');
        let resHeaders = res.getHeaders();
        console.log('response headers: ', resHeaders);
        for (key in resHeaders) {
            result += `${++i}. ${key}: ${resHeaders[key]}<br/>`;
        }

        res.writeHead(200);
        res.end(result);
    }





    this.handleRespStatus = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        
    }
}

module.exports = server => new StaticHandler(server);