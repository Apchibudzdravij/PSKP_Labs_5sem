const url = require('url');
const http = require('http');
const DB = require('../database/db_module')();

function Get_Handler(req, res) {
    let pathname = url.parse(req.url, true).pathname;
    console.log(pathname);



    if (pathname === '/api/faculties') {
        DB.getFaculties().then(records => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(records.recordset), null, 4);
        }).catch(error => { errorHandler(res, 2, error); });
    }

    else if (pathname === '/api/pulpits') {
        DB.getPulpits().then(records => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(records.recordset), null, 4);
        }).catch(error => { errorHandler(res, 3, error); });
    }

    else if (pathname === '/api/subjects') {
        DB.getSubjects().then(records => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(records.recordset), null, 4);
        }).catch(error => { errorHandler(res, 4, error); });
    }

    else if (pathname === '/api/auditoriumtypes') {
        DB.getAuditoriumTypes().then(records => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(records.recordset), null, 4);
        }).catch(error => { errorHandler(res, 5, error); });
    }

    else if (pathname === '/api/auditoriums') {
        DB.getAuditoriums().then(records => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(records.recordset), null, 4);
        }).catch(error => { errorHandler(res, 6, error); });
    }
}

module.exports = (req, res) => new Get_Handler(req, res);