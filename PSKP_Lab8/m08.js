const url = require('url');
const fs = require('fs');
const xmlBuilder = require('xmlbuilder');
const multiParty = require('multiparty');
const { parse } = require('querystring');
const parseString = require('xml2js').parseString;




function StaticHandler(server, sockets) {
    this.server = server;
    this.sockets = sockets;
    const regexNumber = new RegExp('^[0-9]+$');


    // Главная страница — localhost:5000
    this.handleMain = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        res.end('<h1>Welcome! Enter on of the values in URL: </h1>' +
            '<h2>' +
            '/connection <br/>' + '/connection?set=set <br/>' +
            '/headers <br/> ' + '/parameter?x=x&y=y<br/>' +
            '/parameter/x/y <br/>' + '/close <br/>' + '/socket <br/>' +
            '/req-data <br/>' + '/resp-status?code=c&mess=m <br/>' +
            '----------------------------------------- <br/>' +
            '/upload <br/>' + '/formparameter <br/>' + '/json <br/>' +
            '/xml <br/>' + '/files <br/>' + '/files/filename <br/>' +
            '</h2>');
    }






    // Connection (с параметрами или без) — вывод и изменение keepAliveTimeout
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






    // Headers — вывести заголовки, в т.ч. самостоятельно созданный
    this.handleHeaders = (req, res) => {
        let i = 0;
        let result = '<h1>Заголовки запроса:</h1>';
        for (key in req.headers) {
            result += `${++i}. ${key}: ${req.headers[key]}<br/>`;
        }

        i = 0;
        result += '<br/><h1>Заголовки ответа:</h1>';
        res.setHeader('Connection', 'keep-alive');
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






    // Parameter (передача через query и через URI) — вывод их суммы/разности/произведения/частного
    this.handleParameter = (req, res) => {
        let xQuery = url.parse(req.url, true).query.x;
        let yQuery = url.parse(req.url, true).query.y;
        let xRoute = url.parse(req.url).pathname.split('/')[2];
        let yRoute = url.parse(req.url).pathname.split('/')[3];
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        console.log('x = ' + xQuery + '; y = ' + yQuery);

        // если параметры указаны в параметрах (query)
        if (regexNumber.test(xQuery) && regexNumber.test(yQuery)) {
            res.end(`<h1>
                        x = ${xQuery}; y = ${yQuery} <br/>
                        x + y = ${+xQuery + +yQuery} <br/>
                        x - y = ${xQuery - yQuery} <br/>
                        x * y = ${xQuery * yQuery} <br/>
                        x / y = ${xQuery / yQuery}
                    </h1>`);
        }

        // если параметры указаны в URN (после слэша)
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






    // Close — закрытие сервера через 10 секунд
    this.handleClose = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        console.log('The server will disconnect in 10 seconds.');
        setTimeout(() => {
            console.log('Server disconnected.');
            for (const socket of this.sockets.values()) {
                socket.destroy();
            }
            this.server.close();
        }, 10000);
        res.end('<h1>The server will disconnect in 10 seconds.</h1>');
    }






    // Socket — информация о сокетах (Socket = IP + Port)
    this.handleSocket = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>
                    Client port: ${res.socket.remotePort} <br/>
                    Client ip: ${res.socket.remoteAddress} <br/>
                    Server port: ${res.socket.localPort} <br/>
                    Server ip: ${res.socket.localAddress} <br/>
                </h1>`);
    }






    // Req-data — визуализация порционной обработки запроса (через Postman!)
    this.handleReqData = (req, res) => {
        let buf = '';
        let i = 0;
        res.setHeader('Transfer-Encoding', 'chunked');  // введите другие значения (compress, deflate, gzip) для наглядности
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });


        req.on('data', (data) => {
            console.log(++i + '. req.on(data) = ' + data.length);
            res.write(`<h3>${i}. req.on(data) = ${data.length}</h3>`);
            buf += data;
        });


        req.on('end', () => {
            if (buf.length == 0) {
                res.end('<h1>[INFO] Send raw request data using Postman. <br/>' +
                    `(more than 1MB — it\'s about 65536 symbols)</h1>`);
                return;
            }
            console.log('[END] req.on(end) = ' + buf.length);
            res.write(`<h3>[END] req.on(end) = ${buf.length}</h3>`);
            res.end();
        });
    }






    // Resp-status — задать через параметры код ответа и сообщение ответа
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
                res.writeHead(406, 'Invalid StatusCode', { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>[ERROR] Enter valid StatusCode (200-599).</h1>')
            }
        }

        // если statuscode не является числом
        else {
            res.writeHead(407, 'Incorrect StatusCode', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] Enter correct StatusCode (200-599).</h1>')
        }
    }






    // Form-parameter — получение и вывод данных из html-формы
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
            res.writeHead(408, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] 408: Incorrect method (Use GET or POST request method)</h1>');
        }
    }






    // JSON — считать JSON из тела запроса и отправить в ответе новый JSON
    this.handleJson = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        let data = '';

        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => {
            data = JSON.parse(data);
            let result = {};
            result._comment = "res: lab 08";
            result.x_plus_y = data.x + data.y;
            result.concatination_s_and_o = `${data.s}: ${data.o.name} ${data.o.surname}`;
            result.length_m = data.m.length;
            res.end(JSON.stringify(result, null, 2));
        })
    }






    // XML — парсинг пришедшего от клиента XML и возвращение нового XML
    this.handleXml = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        let xmlString = '';

        req.on('data', data => { xmlString += data.toString(); });
        req.on('end', () => {
            parseString(xmlString, (err, result) => {
                if (err) {
                    res.end(`<result>[FATAL] parseString returned error: ${err}</result>`);
                    return;
                }
                let sum = 0;
                let mess = '';
                result.request.x.forEach(el => { sum += Number.parseInt(el.$.value); })
                result.request.m.forEach(el => { mess += el.$.value; })

                let xmlDoc = xmlBuilder.create('response')
                    .att('id', +result.request.$.id + 10)
                    .att('request', result.request.$.id);
                xmlDoc.ele('sum', { element: 'x', sum: `${sum}` });
                xmlDoc.ele('concat', { element: 'm', result: `${mess}` });
                rc = xmlDoc.toString({ pretty: true });

                res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
                res.end(xmlDoc.toString({ pretty: true }));
            });
        })
    }






    // Upload — загрузка файлов на сервер в папку static
    this.handleUpload = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        if (req.method === 'GET') {
            res.end(fs.readFileSync('./upload.html'))
        }

        else if (req.method === 'POST') {
            console.log('post');
            let form = new multiParty.Form({ uploadDir: './static' });
            form.on('file', (name, file) => {
                console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
            });
            form.on('error', err => { res.end(`<h1>[ERROR] form returned error: ${err}</h1>`) });
            form.on('close', () => {
                res.end('<h1>[OK] File sucessfully uploaded.</h1>');
            });
            form.parse(req);
        }

        else {
            res.writeHead(408, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>[ERROR] 408: Incorrect method (Use GET or POST request method)</h1>');
        }
    }






    // Files — вывод кол-ва файлов или получение файла по URI
    this.handleFiles = (req, res) => {
        let filename = url.parse(req.url).pathname.split('/')[2];

        // если нет имени файла в URI, выводится кол-во файлов
        if (filename === undefined) {
            fs.readdir('./static', (err, files) => {
                if (err) {
                    res.end('<h1>[FATAL] Unable to find ./static directory<h1>');
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






    // Ошибка при вводе URL, на которого нет обработчика
    this.handleIncorrectURL = (req, res) => {
        res.writeHead(410, 'Incorrect URL', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] Enter one of the correct URLs (visit localhost:5000).</h1>')
    }






    // Ошибка при неверном методе запроса (не GET/POST)
    this.handleIncorrectMethod = (req, res) => {
        res.writeHead(409, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] Incorrect request method. Use GET or POST (visit localhost:5000 for more info).</h1>')
    }
}


module.exports = (server, sockets) => new StaticHandler(server, sockets);