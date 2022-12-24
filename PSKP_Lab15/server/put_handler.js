const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();




function Put_Handler(req, res) {

    let json = '';
    let pathName = url.parse(req.url, true).pathname;
    console.log('PUT:\t' + pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathName) {

        case '/api/faculties': {

            break;
        }

        case '/api/pulpits': {

            break;
        }

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}



module.exports = (req, res) => new Put_Handler(req, res);