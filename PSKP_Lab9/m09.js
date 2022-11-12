const url = require('url');
const fs = require('fs');
const xmlBuilder = require('xmlbuilder');
const multiParty = require('multiparty');
const { parse } = require('querystring');
const parseString = require('xml2js').parseString;



function ServerModule(server) {
    this.server = server;




    // Task #1:  statusCode, statusMessage, socket info, response body
    this.handleStatusAndSocket = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1> [OK] Server response 09-01 </h1>');
    }




    // Task #2:  GET-parameters
    this.handleParametersGet = (req, res) => {
        let query = url.parse(req.url, true).query
        let parameters = '';

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h2> GET-parameters </h2>  ');
        for (key in query) {
            parameters += `${key} = ${query[key]} <br/> `;
        }
        res.end(parameters);
    }




    // Task #3:  POST-parameters
    this.handleParametersPost = (req, res) => {
        let query = url.parse(req.url, true).query
        let parameters = '';

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h2> POST-parameters </h2>  ');
        for (key in query) {
            parameters += `${key} = ${query[key]} <br/> `;
        }
        res.end(parameters);
    }




    // Task #4:  JSON (POST)
    this.handleJson = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        let data = '';

        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => {
            data = JSON.parse(data);
            let result = {};
            result.__comment = 'res: lab 09';
            result.x_plus_y = data.x + data.y;
            result.concatination_s_and_o = `${data.s}: ${data.o.name} ${data.o.surname}`;
            result.length_m = data.m.length;
            res.end(JSON.stringify(result, null, 2));
        })
    }




    // Task #5:  XML (POST)
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




    // Task #6:  File.txt (POST)
    this.handleTextFile = (req, res) => {
        let result = '';
        let form = new multiParty.Form({ uploadDir: '/' });
        form.parse(req);
        form.on('field', (name, field) => {
            console.log('---- got a field:');
            console.log(name, field);
            result += `<br/>${name} = ${field}`;
        });
        form.on('file', (name, file) => {
            console.log('---- got a file:');
            console.log(name, file);
            result += `<br/>${name} = original name: ${file.originalFilename}; path: ${file.path}`;
        });
        form.on('error', (err) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h2>form error</h2>');
        });
        form.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2>success! form data:</h2>');
            res.end(result);
        });
    }
}





module.exports = server => new ServerModule(server);