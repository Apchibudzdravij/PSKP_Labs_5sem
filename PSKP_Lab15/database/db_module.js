const MongoClient = require('mongodb').MongoClient;
const databaseName = 'BSTU';
const connectionString = `mongodb://localhost:27017/${databaseName}`;



function DB() {

    this.client = new MongoClient(connectionString);
    this.client.connect(); //.then(() => { console.log(`\n[OK] Succesfully connected to MongoDB, database: ${databaseName}\n`); });



    // =============================================   SELECT   =============================================

    this.getFaculties = async () => { return await this.client.db().collection('faculty').find({}).toArray(); }

    this.getPulpits = async () => { return await this.client.db().collection('pulpit').find({}).toArray(); }




    // =============================================   INSERT   =============================================

    this.insertFaculty = async (fields) => {
        let collection = this.client.db().collection('faculty');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
        console.log('INSERT:\t', fields);

        await this.findOneAndThrowException('faculty', facultyToFind, true, 'This faculty already exists');

        let insertResult = await collection.insertOne(fields);
        console.log('RESULT:', insertResult, '\n');

        return collection.findOne(fields).then(record => {
            if (!record) throw 'There is no records';
            else return record;
        });
    }


    this.insertPulpit = async (fields) => {
        let collection = this.client.db().collection('pulpit');
        let pulpitToFind = JSON.parse('{ "pulpit": "' + fields.pulpit + '" }');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
        console.log('INSERT:\t', fields);

        await this.findOneAndThrowException('pulpit', pulpitToFind, true, 'This pulpit already exists');
        await this.findOneAndThrowException('faculty', facultyToFind, false, 'There is no such faculty');

        let insertResult = await collection.insertOne(fields);
        console.log('RESULT:', insertResult, '\n');

        return collection.findOne(fields).then(record => {
            if (!record) throw 'There is no records';
            else return record;
        });
    }




    // =============================================   UPDATE   =============================================

    this.updateFaculty = async (fields, newFacultyName) => {
        let collection = this.client.db().collection('faculty');
        console.log('UPDATE:\t', fields, '\n');

        return collection.findOneAndUpdate(
            { faculty: fields.faculty },
            { $set: { faculty_name: newFacultyName } },
            { returnDocument: 'after' }
        );
    }


    this.updatePulpit = async (fields, newPulpitName, newFaculty) => {
        let collection = this.client.db().collection('pulpit');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
        console.log('UPDATE:\t', fields, '\n');

        await this.findOneAndThrowException('faculty', facultyToFind, false, 'There is no such faculty');

        return collection.findOneAndUpdate(
            { pulpit: fields.pulpit },
            { $set: { pulpit_name: newPulpitName, faculty: newFaculty } },
            { returnDocument: 'after' });
    }







    // =============================================   UTILS   =============================================

    this.findOneAndThrowException = async (collectionName, fieldToFind, boolCondition, errorMessage) => {
        let collection = this.client.db().collection(collectionName);
        await collection.findOne(fieldToFind).then(record => {
            if (boolCondition) {
                if (record) throw errorMessage;
                else return record;
            }
            else {
                if (!record) throw errorMessage;
                else return record;
            }
        });
    }
}



module.exports = () => new DB();