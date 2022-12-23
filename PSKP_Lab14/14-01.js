const sql = require('mssql');
const DB = require('./m14')();

let config = {
    user: 'sa',
    password: '1111',
    server: 'localhost',
    database: 'UNIVER',
    pool: {
        max: 10,
        min: 0,
        // softIdleTimeoutMillis: 5000,
        // idleTimeoutMillis: 10000
    },
    options: {
        trustServerCertificate: true
    }
};


const pool = new sql.ConnectionPool(config, err => {
    if (err) console.log('[ERROR] Cannot connect database.', err.message);
    else {
        console.log('[OK] Connected to database.');
        dbreq01(pool);
        dbreq02(pool);
        dbreq03(pool);
        DB.getFaculties().then(records => {
            console.log(JSON.stringify(records.recordset, null, 4))
        });
    }
})


let dbreq01 = (pool) => { pool.request().query('select faculty, faculty_name from FACULTY', processing_result) };

let dbreq02 = (pool) => { pool.request().query('select faculty, pulpit, pulpit_name from PULPIT order by faculty', processing_result) };

let dbreq03 = (pool) => { pool.request().query('select teacher, teacher_name, pulpit from TEACHER order by pulpit', processing_result) };



// sql.connect(config, err => {

//     if (err) console.log('[ERROR] Cannot connect database.', err.message);
//     else {
//         console.log('[OK] Connected to database.');
//         dbreq01();
//         dbreq02();
//         dbreq03();
//     }
// });



let processing_result = (err, result) => {
    if (err) console.log('processing result error', err.code, err.originalError.info.message);
    else {
        console.log('Количество строк: ', result.rowsAffected[0]);
        let json = '';
        for (let i = 0; i < result.rowsAffected[0]; i++) {
            let str = '--';
            for (key in result.recordset[i]) {
                str += ` ${key} = ${result.recordset[i][key]}`;
            }
            console.log(str);

        }
    }
}