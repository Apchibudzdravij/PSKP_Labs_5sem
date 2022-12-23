const http = require('http');
const fs = require('fs');
const DB = require('./m14')();
let server = http.createServer();


let http_handler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    
    DB.getFaculties().then(records => {
        res.end(JSON.stringify(records.recordset, null, 4))
    });
}



server.listen(5000, () => {
    console.log('Server running at http://localhost:5000/\n');
}).on('error', error => {
    console.log('[ERROR] ', error.message);
}).on('request', http_handler);


// DB.getFaculties().then(records => {
//     console.log(JSON.stringify(records.recordset, null, 4))
// });
