const url = require('url');
const fs = require('fs');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();
const indexFilePath = './static_index.html';


function Get_Handler(req, res) {

    let pathName = url.parse(req.url, true).pathname;
    console.log('GET:\t' + pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathName) {

        case '/':
            try {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(fs.readFileSync(indexFilePath));
            }
            catch (err) { error.handler(res, 408, err.message); }
            break;

        case '/api/faculties': DB.getFaculties()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 403, err.message); });
            break;

        case '/api/pulpits': DB.getPulpits()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(err => { error.handler(res, 404, err.message); });
            break;

        case '/api/subjects': DB.getSubjects()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(err => { error.handler(res, 405, err.message); });
            break;

        case '/api/auditoriumtypes': DB.getAuditoriumTypes()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 406, err.message); });
            break;

        case '/api/auditoriums': DB.getAuditoriums()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 407, err.message); });
            break;

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}


module.exports = (req, res) => new Get_Handler(req, res);