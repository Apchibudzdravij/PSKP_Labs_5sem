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


    // ----------------  ТРАНЗАКЦИЯ  ----------------
    this.insertPulpits = async (documents, transactionOptions) => {
        // инициализируем текущую сессию
        const session = this.client.startSession();
        // коллекции факультетов и палпитов
        let collectionPulpits = this.client.db().collection('pulpit');
        let collectionFaculties = this.client.db().collection('faculty');
        // массивы с входными данными: массив с id палпитов и массив с id факультетов
        let pulpitFieldsArray = documents.map(a => a.pulpit);
        let facultiesFieldsArray = documents.map(a => a.faculty);
        // выводим входные данные
        console.log('INSERT:\t', documents);
        console.log('PULPITS:   ', pulpitFieldsArray);
        console.log('FACULTIES: ', facultiesFieldsArray);
        // начинаем явную транзакцию
        session.startTransaction(transactionOptions);


        // проверяем, есть ли уже в бд такие же палпиты: если уже есть, то кидаем эксепшен
        await collectionPulpits
            .find({ pulpit: { $in: pulpitFieldsArray } }).toArray()
            .then(rec => {
                console.log('PULPITS SEARCH:\t', rec);
                if (rec.length != 0) {
                    session.abortTransaction();
                    throw 'There are already such pulpits';
                }
            })


        //проверяем, есть ли в бд такие факультеты: если таких няма, то кидаем эксепшен
        await collectionFaculties
            .find({ faculty: { $in: facultiesFieldsArray } }).toArray()
            .then(rec => {
                console.log('FACULTIES SEARCH: ', rec);
                if (rec.length != facultiesFieldsArray.length) {
                    session.abortTransaction();
                    throw 'There is no such faculties';
                }
            });

        // если выше не выкинулся эксепшен, то вставляем код в бд
        await collectionPulpits.insertMany(documents).then(res => { console.log('RESULT:\t', res); });

        // коммитим транзакцию
        session.commitTransaction();

        // и возвращаем клиенту что он вставил
        return documents;
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