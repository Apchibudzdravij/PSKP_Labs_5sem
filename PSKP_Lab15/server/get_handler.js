const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();




function Get_Handler(req, res) {

    let pathName = decodeURI(url.parse(req.url).pathname);
    let pathParameters = pathName.split('/');
    let collectionName = pathParameters[2];
    let xyzParameter = pathParameters[3];
    console.log('\nGET:\t ' + pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch ('/api/' + collectionName) {

        case '/api/faculties': {
            console.log('XYZ:\t', xyzParameter)
            if (xyzParameter === undefined) {
                DB.getFaculties()
                    .then(records => { res.end(JSON.stringify(records, null, 4)); })
                    .catch(err => { error.handler(res, 411, err.message); });
            }
            else {
                DB.getFaculty(xyzParameter)
                    .then(records => { res.end(JSON.stringify(records, null, 4)); })
                    .catch(err => { error.handler(res, 419, err.message); });
            }
            break;
        }

        case '/api/pulpits': {
            let facQueryParameter = url.parse(req.url, true).query.fac;
            console.log('XYZ:\t', xyzParameter);
            console.log('FAC:\t', facQueryParameter);

            if (facQueryParameter != undefined) {
                DB.getFacultyPulpits(facQueryParameter)
                    .then(records => { res.end(JSON.stringify(records, null, 4)); })
                    .catch(err => { error.handler(res, 421, err.message); });
            }
            else if (xyzParameter === undefined) {
                DB.getPulpits()
                    .then(records => { res.end(JSON.stringify(records, null, 4)); })
                    .catch(err => { error.handler(res, 412, err.message); });
            }
            else {
                DB.getPulpit(xyzParameter)
                    .then(records => { res.end(JSON.stringify(records, null, 4)); })
                    .catch(err => { error.handler(res, 420, err.message); });
            }
            break;
        }

        default: error.handler(res, 410, 'Incorrect URL'); break;
    }

}


module.exports = (req, res) => new Get_Handler(req, res);