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


setTimeout(() => {
    const req = http.request(options, res => {
        let data = '';
        let xmlObject = null;
        console.log(`\nResponse status: ${res.statusCode} ${res.statusMessage}`);
        res.on('data', chunk => { data += chunk; });

        res.on('end', () => {
            console.log('\n--------------------------------------------\n');
            console.log(`Response body (end): \n${data}`);
            console.log('--------------------------------------------\n');

            parseString(data, (err, parseResult) => {
                xmlObject = parseResult;

                err ? console.log('[FATAL] XML parse error') : console.log('parseString result:\n', parseResult, '\n');

                parseResult.response.sum.map((e, i) => {
                    console.log(`sum attributes:     element = ${e.$.element}, sum = ${e.$.sum}`);
                });

                parseResult.response.concat.map((e, i) => {
                    console.log(`concat attributes:  element = ${e.$.element}, result = ${e.$.result}`);
                });
            })

            console.log('\n--------------------------------------------\n');
        });
    });

    req.on('error', e => { console.log(`[FATAL] ${e.message}\n\n`); })
    req.end(xmlDocument.toString({ pretty: true, standalone: true }));
}, 500);