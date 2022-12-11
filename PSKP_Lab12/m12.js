const fs = require('fs');
const url = require('url');





function FilesModule(serverWS) {
    this.serverWS = serverWS;
    const filePath = 'StudentList.json';
    const backupPath = 'backup';
    let studentList = JSON.parse(fs.readFileSync(filePath));



    //  GET:     /
    this.GetAllStudents = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(studentList, null, 4));
    }



    //  GET:     /n
    this.GetStudentById = (req, res) => {
        let isFoundStudentById = false;
        let id = url.parse(req.url).pathname.split('/')[1];

        studentList.forEach(student => {
            if (student.id === +id) {
                isFoundStudentById = true;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(student, null, 4));
            }
        })

        if (!isFoundStudentById) {
            this.ErrorJsonResponse(res, 1, `There is no student with ID = ${+id}.`)
        }
    }



    //  POST:    /
    this.InsertStudent = (req, res) => {
        let isExistsStudentWithId = false;
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', () => {
            studentList.forEach(student => {
                if (student.id === +JSON.parse(body).id) {
                    isExistsStudentWithId = true;
                    this.ErrorJsonResponse(res, 2, `There is already a student with ID = ${student.id}.`);
                }
            });

            if (!isExistsStudentWithId) {
                studentList.push(JSON.parse(body));
                fs.writeFile(filePath, JSON.stringify(studentList, null, 4), error => {
                    if (error) {
                        this.ErrorJsonResponse(res, 10, `Error during writing file ${filePath}.`);
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(JSON.parse(body), null, 4));
                    }
                });
            }
        })
    }



    //  PUT:    /
    this.UpdateStudent = (req, res) => {
        let isFoundStudentWithId = false;
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', () => {
            studentList.forEach(student => {
                if (student.id === +JSON.parse(body).id) {
                    isFoundStudentWithId = true;
                    student.name = JSON.parse(body).name;
                    student.bday = JSON.parse(body).bday;
                    student.speciality = JSON.parse(body).speciality;
                    fs.writeFile(filePath, JSON.stringify(studentList, null, 4), error => {
                        if (error) {
                            this.ErrorJsonResponse(res, 10, `Error during writing file ${filePath}.`);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(JSON.parse(body), null, 4));
                        }
                    });

                }
            });

            if (!isFoundStudentWithId) {
                this.ErrorJsonResponse(res, 3, `There is no student with ID = ${+JSON.parse(body).id}.`)
            }
        })
    }



    //  DELETE:     /n
    this.DeleteStudentById = (req, res) => {
        let isFoundStudentWithId = false;
        let id = url.parse(req.url).pathname.split('/')[1];

        studentList.forEach(student => {
            if (student.id === +id) {
                isFoundStudentWithId = true;
                fs.writeFile(filePath, JSON.stringify(studentList.filter(s => s.id != +id), null, 4), error => {
                    if (error) {
                        this.ErrorJsonResponse(res, 10, `Error during writing file ${filePath}.`);
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(student, null, 4));
                    }
                });

            }
        });

        if (!isFoundStudentWithId) {
            this.ErrorJsonResponse(res, 4, `There is no student with ID = ${+id}.`)
        }
    }



    //  POST    /backup
    this.BackupStudentList = (req, res) => {
        let dateNow = new Date();
        let dateISOSplitted = new Date().toISOString().split('-');
        let dateFormat = dateISOSplitted[0] + dateISOSplitted[1] + (dateISOSplitted[2])[0] + (dateISOSplitted[2])[1] + dateNow.getHours() + dateNow.getMinutes();
        let backupFilePath = `./${backupPath}/${dateFormat}_${filePath}`;

        setTimeout(() => {
            fs.copyFile(filePath, backupFilePath, error => {
                if (error) {
                    this.ErrorJsonResponse(res, 11, `Error during backing up file ${backupFilePath}.`);
                }
                else {
                    console.log('Successfully backed up!\n');
                    this.statusJson(res, 200, "Successfully backed up!");
                }
            })
        }, 2000);
    }



    // DELETE   /backup/YYYYDDMM
    this.DeleteOldBackups = (req, res) => {
        let dateParam = url.parse(req.url).pathname.split('/')[2];

        fs.readdir(backupPath, { withFileTypes: false }, (error, files) => {
            if (error) {
                this.ErrorJsonResponse(res, 12, `Cannot access ${backupPath} backup directory.`);
            }
            else {
                if (files.length === 0) {
                    this.statusJson(res, 201, `There are no files in ${backupPath} directory.`);
                }
                else {
                    for (let i = 0; i < files.length; ++i) {
                        if (+files[i].toString().substring(0, 8) < +dateParam) {
                            fs.unlink(`${backupPath}/${files[i]}`, error => {
                                if (error) {
                                    this.ErrorJsonResponse(res, 13, `Cannot delete file ${backupPath}/${files[i]}.`);
                                }
                                else {
                                    this.statusJson(res, 200, "Successfully deleted old backups!");
                                }
                            })
                        }
                        else {
                            this.statusJson(res, 202, `There are no backups older than ${dateParam}.`);
                        }
                    }
                }
            }
        })
    }



    // GET      /backup
    this.GetAllBackups = (req, res) => {
        let backupsList = [];

        fs.readdir(backupPath, { withFileTypes: false }, (error, files) => {
            if (error) {
                this.ErrorJsonResponse(res, 14, `Cannot access ${backupPath} backup directory.`);
            }
            else {
                console.log(`There are ${files.length} files in ${backupPath} directory:`);
                if (files.length === 0) {
                    this.statusJson(res, 202, `There are ${files.length} files in ${backupPath} directory.`);
                }
                else {
                    for (let i = 0; i < files.length; ++i) {
                        console.log(i + '. ' + files[i]);
                        backupsList.push({ id: i, name: files[i] });
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(backupsList, null, 4));
                }
            }
        })
    }





    this.statusJson = (res, statusCode, statusMessage) => {
        res.writeHead(+statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: statusMessage }, null, 4));
    }

    this.ErrorJsonResponse = (res, errorCode, errorMessage) => {
        res.writeHead(408, errorMessage, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ errorCode: errorCode, errorMessage: errorMessage }, null, 4));
    }

    this.ErrorIncorrectMethod = res => {
        res.writeHead(409, 'Incorrect method', { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ errorCode: 409, errorMessage: "Incorrect method." }, null, 4));
    }

    this.ErrorIncorrectURL = res => {
        res.writeHead(410, 'Incorrect URL', { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ errorCode: 410, errorMessage: "Incorrect URL." }, null, 4));
    }





    // serverWS.event('A');

    serverWS.on('connection', ws => {
        console.log('Connected.');

        fs.watch(filePath, (eventType, filename) => {
            if (eventType === 'change') {
                // serverWS.emit('A', 'event A emitted');
                serverWS.clients.forEach(client => {
                    if (client.readyState === ws.OPEN) {
                        client.send(`${filename} was modified.`);
                    }
                })
            }
        });
        fs.readdir(backupPath, (error, files) => {
            if (error)
                this.ErrorJsonResponse(res, 15, `Cannot acces directory ${backupPath}.`);
            else {
                for (let i = 0; i < files.length; i++) {
                    fs.watch((backupPath + '/' + files[i]), (eventType, filename) => {
                        if (eventType === 'change') {
                            serverWS.clients.forEach((client) => {
                                if (client.readyState === ws.OPEN) {
                                    client.send(`${backupPath}/${filename} was modified.`);
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}




module.exports = serverWS => new FilesModule(serverWS);