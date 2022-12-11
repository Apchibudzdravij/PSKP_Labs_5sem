const fs = require('fs');


function FilesModule(server) {
    this.server = server;
    let studentList = JSON.parse(fs.readFileSync('./StudentList.json'));



    this.GetAllStudents = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(studentList, null, 2));
    }



    this.GetStudentById = (req, res, id) => {
        console.log('/n');
        console.log(id);
        studentList.forEach(student => {
            console.log('iter');
            if (student.id == +id) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(student);
            }
        })
    }



    this.InsertStudent = (req, res) => {

    }



    this.UpdateStudent = (req, res) => {

    }



    this.DeleteStudentById = (req, res) => {

    }



    this.BackupStudentList = (req, res) => {

    }



    this.DeleteOldBackups = (req, res) => {

    }



    this.GetAllBackups = (req, res) => {

    }




    this.ErrorIncorrectMethod = (req, res) => {
        res.writeHead(409, 'Incorrect method', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] 409: Incorrect request method.</h1>')
    }

    this.ErrorIncorrectURL = (req, res) => {
        res.writeHead(410, 'Incorrect URL', { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>[ERROR] 410: Incorrect URL.</h1>')
    }
}




module.exports = server => new FilesModule(server);