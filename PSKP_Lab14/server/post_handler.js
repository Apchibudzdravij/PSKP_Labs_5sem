const url = require('url');
const error = require('./server_error_handler')();
const DB = require('../database/db_module')();


function Post_Handler(req, res) {

    let json = '';
    let pathName = url.parse(req.url, true).pathname;
    console.log(pathName);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });


    switch (pathName) {

        case '/api/faculties': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                json = JSON.parse(json);
                console.log('JSON string to insert: ' + JSON.stringify(json) + '\n');
                DB.insertFaculties(json.FACULTY, json.FACULTY_NAME)
                    .then(() => { res.end(JSON.stringify(json)); })
                    .catch(err => { error.handler(res, 416, err.message); });
            });
            break;
        }


        case '/api/pulpits': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                json = JSON.parse(json);
                console.log('JSON string to insert: ' + JSON.stringify(json) + '\n');
                DB.insertPulpits(json.PULPIT, json.PULPIT_NAME, json.FACULTY)
                    .then(() => { res.end(JSON.stringify(json)); })
                    .catch(err => { error.handler(res, 417, err.message); });
            });
            break;
        }


        case '/api/subjects': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                json = JSON.parse(json);
                console.log('JSON string to insert: ' + JSON.stringify(json) + '\n');
                DB.insertSubjects(json.SUBJECT, json.SUBJECT_NAME, json.PULPIT)
                    .then(() => { res.end(JSON.stringify(json)); })
                    .catch(err => { error.handler(res, 418, err.message); });
            });
            break;
        }


        case '/api/auditoriumtypes': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                json = JSON.parse(json);
                console.log('JSON string to insert: ' + JSON.stringify(json) + '\n');
                DB.insertAuditoriumTypes(json.AUDITORIUM_TYPE, json.AUDITORIUM_TYPENAME)
                    .then(() => { res.end(JSON.stringify(json)); })
                    .catch(err => { error.handler(res, 419, err.message); });
            });
            break;
        }


        case '/api/auditoriums': {
            req.on('data', chunk => { json += chunk; });
            req.on('end', () => {
                json = JSON.parse(json);
                console.log('JSON string to insert: ' + JSON.stringify(json) + '\n');
                DB.insertAuditoriums(json.AUDITORIUM, json.AUDITORIUM_NAME, json.AUDITORIUM_CAPACITY, json.AUDITORIUM_TYPE)
                    .then(() => { res.end(JSON.stringify(json)); })
                    .catch(err => { error.handler(res, 420, err.message); });
            });
            break;
        }

        
        default: error.handler(res, 410, 'Incorrect URL'); break;
    }
}



module.exports = (req, res) => new Post_Handler(req, res);
