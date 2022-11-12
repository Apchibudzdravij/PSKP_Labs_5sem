const http = require('http');
const xmlBuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;


const xmlDocument = xmlBuilder.create('request').att('id', 300)
xmlDocument.ele('x').att('value', 10);
xmlDocument.ele('x').att('value', 20);
xmlDocument.ele('x').att('value', 30);
xmlDocument.ele('m').att('value', 'l');
xmlDocument.ele('m').att('value', 'o');
xmlDocument.ele('m').att('value', 'l');


const options = {
    host: '127.0.0.1',
    path: '/5',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'text/xml',
        'Accept': 'text/xml'
    }
}


const req = http.request(options, res => {
    let data = '';
    console.log(`Response status: ${res.statusCode} ${res.statusMessage}`);
    res.on('data', chunk => { data += chunk; })
    res.on('end', () => {
        console.log(`Response body (end):\n${data}\n\n`);
        parseString(data, (err, str) => {
            if (err) console.log('[FATAL] XML parse error');
            else {
                console.log('str = ', str);
                console.log('str.result = ', str.result);
            }
        })
    });
});

req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
req.end(xmlDocument.toString({ pretty: true }));