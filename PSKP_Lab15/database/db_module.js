const MongoClient = require('mongodb').MongoClient;
const databaseName = 'BSTU';
const connectionString = `mongodb://localhost:27017/${databaseName}`;


function DB() {

}



module.exports = () => new DB();