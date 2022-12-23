const url = require('url');
const fs = require('fs');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();
const indexFilePath = './static_index.html';


function Get_Handler(req, res) {

    let pathName = url.parse(req.url, true).pathname;
    console.log(pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathName) {

        case '/':
            try { res.end(fs.readFileSync(indexFilePath)); }
            catch (err) { error.handler(res, 408, err.message); }
            break;

        case '/api/faculties': DB.getFaculties()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 411, err.message); });
            break;

        case '/api/pulpits': DB.getPulpits()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(err => { error.handler(res, 412, err.message); });
            break;

        case '/api/subjects': DB.getSubjects()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(err => { error.handler(res, 413, err.message); });
            break;

        case '/api/auditoriumtypes': DB.getAuditoriumTypes()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 414, err.message); });
            break;

        case '/api/auditoriums': DB.getAuditoriums()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(err => { error.handler(res, 415, err.message); });
            break;

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}


module.exports = (req, res) => new Get_Handler(req, res);