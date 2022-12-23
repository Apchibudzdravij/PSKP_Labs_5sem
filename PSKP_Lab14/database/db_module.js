const sql = require('mssql');

let config = {
    user: 'sa',
    password: '1111',
    server: 'localhost',
    database: 'UNIVER',
    pool: {
        max: 10,
        min: 0,
    },
    options: {
        trustServerCertificate: true
    }
};



function DB() {

    this.connPool = new sql.ConnectionPool(config).connect().then(pool => {
        console.log('[OK] Connected to database.\n');
        return pool;
    }).catch(err => console.log('[ERROR] Connection to database failed: ', err.message));




    // =============================================   SELECT   =============================================

    this.getFaculties = () => { return this.connPool.then(pool => pool.request().query('select * from FACULTY')) }

    this.getPulpits = () => { return this.connPool.then(pool => pool.request().query('select * from PULPIT')) }

    this.getSubjects = () => { return this.connPool.then(pool => pool.request().query('select * from SUBJECT')) }

    this.getAuditoriumTypes = () => { return this.connPool.then(pool => pool.request().query('select * from AUDITORIUM_TYPE')) }

    this.getAuditoriums = () => { return this.connPool.then(pool => pool.request().query('select * from AUDITORIUM')) }




    // =============================================   INSERT   =============================================


    this.insertFaculties = (faculty, facultyName) => {
        return this.connPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('facultyName', sql.NVarChar, facultyName)
                .query('insert FACULTY(FACULTY, FACULTY_NAME) values (@faculty, @facultyName)');
        });
    }

    this.insertPulpits = (pulpit, pulpitName, faculty) => {
        return this.connPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpitName', sql.NVarChar, pulpitName)
                .input('faculty', sql.NVarChar, faculty)
                .query('insert PULPIT(PULPIT, PULPIT_NAME, FACULTY) values (@pulpit, @pulpitName, @faculty)');
        });
    }

    this.insertSubjects = (subject, subjectName, pulpit) => {
        return this.connPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subjectName', sql.NVarChar, subjectName)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('insert SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values (@subject, @subjectName, @pulpit)');
        });
    }

    this.insertAuditoriumTypes = (audType, audTypeName) => {
        return this.connPool.then(pool => {
            return pool.request()
                .input('audType', sql.NVarChar, audType)
                .input('audTypeName', sql.NVarChar, audTypeName)
                .query('insert AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values (@audType, @audTypeName)');
        });
    }

    this.insertAuditoriums = (auditorium, auditorium_name, auditorium_capacity, auditorium_type) => {
        return this.connPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)' +
                    ' values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)');
        });
    }

}



module.exports = () => new DB();