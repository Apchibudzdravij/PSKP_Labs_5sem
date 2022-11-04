const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');
const { parse } = require('querystring');



function StaticHandler(server) {
    this.server = server;
    let regexNumber = new RegExp('^[0-9]+$');


    this.handleMain = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        res.end('<h1>Welcome! Enter on of the values in URL: </h1><h2>' +
            '/connection <br/>' + '/connection?set=set <br/>' +
            '/parameter?x=x&y=y<br/>' + '/parameter/x/y <br/>' +
            '/close <br/>' + '/socket <br/>' + '/req-data <br/>' +
            '/resp-status?code=c&mess=m <br/>' +
            '------------------------------------------ <br/>' +
            '/upload <br/>' + '/formparameter <br/>' + '/json <br/>' +
            '/xml <br/>' + '</h2>');
    }






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
        let statusCode = url.parse(req.url, true).query.code;
        let statusMessage = url.parse(req.url, true).query.mess;
        console.log('code = ' + statusCode);
        console.log('mess = ' + statusMessage);

        // если параметры отсутствуют
        if (statusCode === undefined || statusMessage === undefined) {
            res.writeHead(405, 'Incorrect parameters', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] Enter parameters in URI: code = int, mess = string.</h1>')
        }

        // если есть корректные параметры: число и строка
        else if (regexNumber.test(statusCode)) {
            if (+statusCode >= 200 && +statusCode < 600) {
                res.writeHead(+statusCode, statusMessage, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>[OK] Responsed with StatusCode = ${statusCode} and StatusMessage = ${statusMessage}</h1>`);
            }
            else {
                res.writeHead(405, 'Invalid StatusCode', { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>[ERROR] Enter valid StatusCode (200-599).</h1>')
            }
        }

        // если statuscode не является числом
        else {
            res.writeHead(406, 'Incorrect StatusCode', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] Enter correct StatusCode (200-599).</h1>')
        }
    }






    this.handleReqData = (req, res) => {
        let buf = '';
        let i = 0;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });


        req.on('data', (data) => {
            console.log(++i + '. req.on(data) = ' + data.length);
            res.write(`<h3>${i}. req.on(data) = ${data.length}</h3>`);
            buf += data;
        });


        req.on('end', () => {
            if (buf.length == 0) {
                res.end('<h1>[INFO] Send raw request data using Postman. <br/>' +
                    '(more than 1MB — it' + '\'' + 's about 65536 symbols)</h1>');
                return;
            }
            console.log('[END] req.on(end) = ' + buf.length);
            res.write(`<h3>[END] req.on(end) = ${buf.length}</h3>`);
            res.end();
        });
    }






    this.handleFormParameter = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        if (req.method === 'GET') {
            res.end(fs.readFileSync('./formParameter.html'));
        }


        else if (req.method === 'POST') {
            let body = '';
            let parm = '';
            req.on('data', chunk => { body += chunk.toString(); });

            req.on('end', () => {
                parm = parse(body);
                console.log('parm = ', parm);
                res.end(`<h2>
                            Text: ${parm.inpText} <br/>
                            Number: ${parm.inpNumber} <br/>
                            Date: ${parm.inpDate} <br/>
                            Checkbox-1: ${parm.inpCheck1} <br/>
                            Checkbox-2: ${parm.inpCheck2} <br/>
                            Radiobutton: ${parm.inpRadio} <br/>
                            Textarea: ${parm.inpTextArea} <br/>
                            Submit: ${parm.inpSubmitForm} <br/>
                        </h2>`);
            });
        }

        else {
            res.writeHead(405, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] 405: Incorrect method (Use GET or POST request method)</h1>');
        }
    }






    this.handleJson = (req, res) => {

    }






    this.handleXml = (req, res) => {

    }






    this.handleUpload = (req, res) => {

    }
}

module.exports = server => new StaticHandler(server);