const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();



function Get_Handler(req, res) {

    let pathname = url.parse(req.url, true).pathname;
    console.log(pathname);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathname) {

        case '/api/faculties': DB.getFaculties()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(error => { error.handler(res, 411, error.message); });
            break;

        case '/api/pulpits': DB.getPulpits()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(error => { error.handler(res, 412, error.message); });
            break;

        case '/api/subjects': DB.getSubjects()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); }).
            catch(error => { error.handler(res, 413, error.message); });
            break;

        case '/api/auditoriumtypes': DB.getAuditoriumTypes()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(error => { error.handler(res, 414, error.message); });
            break;

        case '/api/auditoriums': DB.getAuditoriums()
            .then(records => { res.end(JSON.stringify(records.recordset, null, 4)); })
            .catch(error => { error.handler(res, 415, error.message); });
            break;

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}


module.exports = (req, res) => new Get_Handler(req, res);