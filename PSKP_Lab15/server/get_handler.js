const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();




function Get_Handler(req, res) {

    let pathName = url.parse(req.url, true).pathname;
    console.log('GET:\t ' + pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathName) {

        case '/api/faculties': {
            DB.getFaculties()
                .then(records => { res.end(JSON.stringify(records, null, 4)); })
                .catch(err => { error.handler(res, 411, err.message); });
            break;
        }

        case '/api/pulpits': {
            DB.getPulpits()
                .then(records => { res.end(JSON.stringify(records, null, 4)); })
                .catch(err => { error.handler(res, 412, err.message); });
            break;
        }

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }

}


module.exports = (req, res) => new Get_Handler(req, res);