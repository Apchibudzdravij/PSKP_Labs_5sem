const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017/BSTU'


function DB() {

}



module.exports = () => new DB();