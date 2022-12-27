const MongoClient = require('mongodb').MongoClient;
const databaseName = 'BSTU';
const connectionString = `mongodb://localhost:27017/${databaseName}`;



function DB() {

    this.client = new MongoClient(connectionString);
    this.client.connect(); //.then(() => { console.log(`\n[OK] Succesfully connected to MongoDB, database: ${databaseName}\n`); });



    // =============================================   SELECT   =============================================

    this.getFaculties = async () => await this.client.db().collection('faculty').find({}).toArray();

    this.getPulpits = async () => await this.client.db().collection('pulpit').find({}).toArray();

    this.getFaculty = async (faculty) => await this.client.db().collection('faculty').find({ faculty: faculty }).toArray();

    this.getPulpit = async (pulpit) => await this.client.db().collection('pulpit').find({ pulpit: pulpit }).toArray();

    this.getFacultyPulpits = async (faculties) => await this.client.db().collection('pulpit').find({ faculty: { $in: faculties } }).toArray();





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


    this.insertPulpits = async (documents) => {
        let collection = this.client.db().collection('pulpit');
        let collectionFaculties = this.client.db().collection('pulpit');
        let pulpitFieldsArray = documents.map(a => a.PULPIT);
        let facultiesFieldsArray = documents.map(a => a.FACULTY);
        console.log('INSERT:\t', documents);
        console.log('PULPITS:   ', pulpitFieldsArray);
        console.log('FACULTIES: ', facultiesFieldsArray);

        let recordsPulpits = collection.find({ pulpit: { $in: pulpitFieldsArray } }).toArray();
        console.log('RECORD:  ', recordsPulpits);
        if (recordsPulpits.length > 0) throw 'There are already such pulpits';


        let recordsFaculties = await collectionFaculties.find({ faculty: { $in: facultiesFieldsArray } }).toArray()
            .then(rec => { console.log('TEST:\t',rec) });
        recordsFaculties.then(record => {
            if (record.length == 0) throw 'There are already such faculties';
            else return record;
        })

        let insertResult = await collection.insertMany(documents);
        console.log('RESULT:', insertResult, '\n');

        let returnRecord = collection.find({ pulpit: { $in: pulpitFieldsArray } }).toArray();
        returnRecord.then(record => {
            console.log('RETURN:  ', record);
            return record;
        });
    }





    // =============================================   UPDATE   =============================================

    this.updateFaculty = async (fields, newFacultyName) => {
        let collection = this.client.db().collection('faculty');
        console.log('UPDATE:\t', fields);

        return collection.findOneAndUpdate(
            { faculty: fields.faculty },
            { $set: { faculty_name: newFacultyName } },
            { returnDocument: 'after' }
        );
    }


    this.updatePulpit = async (fields, newPulpitName, newFaculty) => {
        let collection = this.client.db().collection('pulpit');
        let facultyToFind = JSON.parse('{"faculty": "' + fields.faculty + '"}');
        console.log('UPDATE:\t', fields);

        await this.findOneAndThrowException('faculty', facultyToFind, false, 'There is no such faculty');

        return collection.findOneAndUpdate(
            { pulpit: fields.pulpit },
            { $set: { pulpit_name: newPulpitName, faculty: newFaculty } },
            { returnDocument: 'after' });
    }





    // =============================================   DELETE   =============================================

    this.deleteFaculty = async (facultyToDelete) => {
        let collection = this.client.db().collection('faculty');
        console.log('DELETE:\t', facultyToDelete);

        return collection.findOneAndDelete({ faculty: facultyToDelete },);
    }


    this.deletePulpit = async (pulpitToDelete) => {
        let collection = this.client.db().collection('pulpit');
        console.log('DELETE:\t', pulpitToDelete);

        return collection.findOneAndDelete({ pulpit: pulpitToDelete },);
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