const MongoClient = require('mongodb').MongoClient;
const databaseName = 'BSTU';
const connectionString = `mongodb://localhost:27017/${databaseName}`;



function DB() {

    this.client = new MongoClient(connectionString);
    this.client.connect().then(() => { console.log(`\n[OK] Succesfully connected to MongoDB, database: ${databaseName}\n`); });



    // =============================================   SELECT   =============================================


    this.getPulpits = async () => {
        let collection = this.client.db().collection('pulpit');
        let docs = await collection.find({}).toArray();
        // docs.forEach(el => { console.log(el.pulpit, el.pulpit_name, el.faculty); });
        return docs;
    }

    this.getFaculties = async () => {
        let collection = this.client.db().collection('faculty');
        let docs = await collection.find({}).toArray();
        // docs.forEach(el => { console.log(el.faculty, el.faculty_name); });
        return docs;
    }
}



module.exports = () => new DB();