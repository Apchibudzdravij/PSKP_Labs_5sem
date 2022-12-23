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

    this.connectionPool = new sql.ConnectionPool(config).connect().then(pool => {
        console.log('[OK] Connected to database.\n');
        return pool;
    }).catch(err => console.log('[ERROR] Connection failed: ', err.message));



    this.getFaculties = () => {
        return this.connectionPool.then(pool => pool.request().query('select * from FACULTY'))
    }
}

module.exports = () => new DB();