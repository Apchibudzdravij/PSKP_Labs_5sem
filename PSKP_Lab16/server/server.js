const http = require('http');
const { graphql, buildSchema } = require('graphql');
const { handleResponse, handleError } = require('./response_handler');
const { DB } = require('../database/db_module');
const schema = buildSchema(require('fs').readFileSync('../database/schema.graphql').toString());
const resolver = require('./resolver');
const server = http.createServer();




const http_handler = (req, res) => {
    if (req.method === 'POST') {
        let reqData = '';
        req.on('data', chunk => { reqData += chunk; });
        req.on('end', () => {

            try {
                let json = JSON.parse(reqData);
                let variables = json.variables ? json.variables : {};
                console.log('\nQUERY:\n', json);

                if (json.query) {
                    graphql(schema, json.query, resolver, context, variables)
                        .then(result => {
                            if (result.errors) {
                                let json = JSON.stringify({ errorMessage: result.errors[0].message }, null, 4);
                                handleError(res, '\n[ERROR] Query:\n', json);
                            }
                            else if (result.data) {
                                let json = JSON.stringify(result.data, null, 4);
                                handleResponse(res, '\nRESULT:\n', json);
                            }
                        })
                }

                else if (json.mutation) {
                    graphql(schema, json.mutation, resolver, context, variables)
                        .then(result => {
                            if (result.errors) {
                                let json = JSON.stringify({ errorMessage: result.errors[0].message }, null, 4);
                                handleError(res, '\n[ERROR] Mutation:\n', json);
                            }
                            else if (result.data) {
                                let json = JSON.stringify(result.data, null, 4);
                                handleResponse(res, '\nRESULT:\n', json);
                            }
                        })
                }

                else {
                    handleError(res, '\n[ERROR]\n', JSON.stringify({ errorMessage: 'Invalid JSON request. Enter query or mutation' }));
                }
            }

            catch (err) {
                handleError(res, '\n[ERROR]\n', JSON.stringify({ errorMessage: `Request error: ${err.message}` }));
            }
        })
    }

    else {
        handleError(res, '\n[ERROR]\n', JSON.stringify({ errorMessage: 'Incorrect method' }));
    }
}




const context = DB(err => {
    if (err)
        console.error('[ERROR] Cannot connect to database.');
    else {
        console.log('\n[OK] Succesfully connected to database.');
        server.listen(5000, () => { console.log('[INFO] Server running at localhost:5000/') })
            .on('error', err => { console.log('[ERROR] ', err.code); })
            .on('request', http_handler);
    }
});
