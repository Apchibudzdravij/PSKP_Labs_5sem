const mssql = require('mssql');


let config = {
    user: 'sa',
    password: '1111',
    server: 'localhost',
    database: 'UNIVER_GraphQL',
    pool: { max: 10, min: 0, },
    options: { trustServerCertificate: true }
};




function DB(callBack) {


    // ========================  GET  ========================

    this.getFaculties = (args, context) => {
        return (new mssql.Request())
            .query('select * from FACULTY')
            .then(record => { return record.recordset });
    };

    this.getPulpits = (args, context) => {
        return (new mssql.Request())
            .query('select * from PULPIT')
            .then(record => { return record.recordset; });
    };

    this.getSubjects = (args, context) => {
        return (new mssql.Request())
            .query('select * from SUBJECT')
            .then(record => { return record.recordset; });
    };

    this.getTeachers = (args, context) => {
        return (new mssql.Request())
            .query('select * from TEACHER')
            .then(record => { return record.recordset; });
    };

    this.getFaculty = (args, context) => {
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('select top(1) * from FACULTY where FACULTY = @faculty')
            .then(record => { return record.recordset; });
    };

    this.getPulpit = (args, context) => {
        return (new mssql.Request())
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('select top(1) * from PULPIT where PULPIT = @pulpit')
            .then(record => { return record.recordset; });
    };

    this.getSubject = (args, context) => {
        return (new mssql.Request())
            .input('subject', mssql.NVarChar, args.SUBJECT)
            .query('select top(1) * from SUBJECT where SUBJECT = @subject')
            .then(record => { return record.recordset; });
    };

    this.getTeacher = (args, context) => {
        return (new mssql.Request())
            .input('teacher', mssql.NVarChar, args.TEACHER)
            .query('select top(1) * from TEACHER where TEACHER = @teacher')
            .then(record => { return record.recordset; });
    };


    this.getTeachersByFaculty = (args, context) => {
        console.log(args);
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('select TEACHER.*, PULPIT.FACULTY from TEACHER ' +
                'join PULPIT on TEACHER.PULPIT = PULPIT.PULPIT ' +
                'join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY where FACULTY.FACULTY = @faculty')
            .then(record => {
                let zaps = o => {
                    return {
                        TEACHER: o.TEACHER,
                        TEACHER_NAME: o.TEACHER_NAME,
                        PULPIT: o.PULPIT
                    }
                };
                let zapp = o => {
                    return {
                        FACULTY: o.FACULTY,
                        TEACHERS: [zaps(o)]
                    }
                };
                let rc = [];
                record.recordset.forEach((el, index) => {
                    if (index === 0)
                        rc.push(zapp(el));
                    else if (rc[rc.length - 1].FACULTY !== el.FACULTY)
                        rc.push(zapp(el));
                    else
                        rc[rc.length - 1].TEACHERS.push(zaps(el));
                });
                console.log(rc)
                return rc;
            })
    };


    this.getSubjectsByFaculties = (args, context) => {
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('select SUBJECT.*, PULPIT.PULPIT_NAME, PULPIT.FACULTY from SUBJECT ' +
                'join PULPIT on subject.PULPIT = PULPIT.PULPIT ' +
                'join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY where FACULTY.FACULTY = @faculty')
            .then(record => {
                let zaps = o => {
                    return {
                        SUBJECT: o.SUBJECT,
                        SUBJECT_NAME: o.SUBJECT_NAME,
                        PULPIT: o.PULPIT
                    }
                };
                let zapp = o => {
                    return {
                        PULPIT: o.PULPIT,
                        PULPIT_NAME: o.PULPIT_NAME,
                        FACULTY: o.FACULTY,
                        SUBJECTS: [zaps(o)]
                    }
                };
                let rc = [];
                record.recordset.forEach((el, index) => {
                    if (index === 0)
                        rc.push(zapp(el));
                    else if (rc[rc.length - 1].PULPIT !== el.PULPIT)
                        rc.push(zapp(el));
                    else
                        rc[rc.length - 1].SUBJECTS.push(zaps(el));
                });
                console.log(rc)
                return rc;
            });
    };





    // ===============================  INSERT  ===============================

    this.insertFaculty = (args, context) => {
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .input('faculty_name', mssql.NVarChar, args.FACULTY_NAME)
            .query('insert FACULTY(FACULTY, FACULTY_NAME) values (@faculty, @faculty_name)')
            .then(record => { return args });
    };

    this.insertPulpit = (args, context) => {
        return (new mssql.Request())
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .input('pulpit_name', mssql.NVarChar, args.PULPIT_NAME)
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('insert PULPIT(PULPIT, PULPIT_NAME, FACULTY) values (@pulpit, @pulpit_name, @faculty)')
            .then(record => { return args });
    };

    this.insertSubject = (args, context) => {
        return (new mssql.Request())
            .input('subject', mssql.NVarChar, args.SUBJECT)
            .input('b', mssql.NVarChar, args.SUBJECT_NAME)
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('insert SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values (@subject, @b, @pulpit)')
            .then(record => { return args });
    };

    this.insertTeacher = (args, context) => {
        return (new mssql.Request())
            .input('teacher', mssql.NVarChar, args.TEACHER)
            .input('b', mssql.NVarChar, args.TEACHER_NAME)
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('insert teacher(TEACHER, TEACHER_NAME, PULPIT) values (@teacher, @b, @pulpit)')
            .then(record => { return args });
    };





    // ======================================  UPDATE  ======================================

    this.updateFaculty = (args, context) => {
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .input('faculty_name', mssql.NVarChar, args.FACULTY_NAME)
            .query('update FACULTY set FACULTY = @faculty, FACULTY_NAME = @faculty_name where FACULTY = @faculty')
            .then(record => { return (record.rowsAffected[0] === 0) ? null : args; });
    };

    this.updatePulpit = (args, context) => {
        return (new mssql.Request())
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .input('pulpit_name', mssql.NVarChar, args.PULPIT_NAME)
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('update PULPIT set PULPIT = @pulpit, PULPIT_NAME = @pulpit_name, FACULTY = @faculty where PULPIT = @pulpit')
            .then(record => { return (record.rowsAffected[0] === 0) ? null : args; });
    };

    this.updateSubject = (args, context) => {
        return (new mssql.Request())
            .input('subject', mssql.NVarChar, args.SUBJECT)
            .input('b', mssql.NVarChar, args.SUBJECT_NAME)
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('update SUBJECT set SUBJECT = @subject, SUBJECT_NAME = @b, PULPIT = @pulpit where SUBJECT = @subject')
            .then(record => { return (record.rowsAffected[0] === 0) ? null : args; });
    };

    this.updateTeacher = (args, context) => {
        return (new mssql.Request())
            .input('teacher', mssql.NVarChar, args.TEACHER)
            .input('b', mssql.NVarChar, args.TEACHER_NAME)
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('update TEACHER set TEACHER = @teacher, TEACHER_NAME = @b, PULPIT = @pulpit where TEACHER = @teacher')
            .then(record => { return (record.rowsAffected[0] === 0) ? null : args; });
    };





    // ==========================  DELETE  ==========================

    this.delFaculty = (args, context) => {
        return (new mssql.Request())
            .input('faculty', mssql.NVarChar, args.FACULTY)
            .query('delete from FACULTY where FACULTY = @faculty')
            .then(record => {
                return record.rowsAffected[0] == 0 ? null : args;
            });
    };

    this.delPulpit = (args, context) => {
        return (new mssql.Request())
            .input('pulpit', mssql.NVarChar, args.PULPIT)
            .query('delete from PULPIT where PULPIT = @pulpit')
            .then(record => {
                return record.rowsAffected[0] == 0 ? null : args;
            });
    };

    this.delSubject = (args, context) => {

        return (new mssql.Request())
            .input('subject', mssql.NVarChar, args.SUBJECT)
            .query('delete from SUBJECT where SUBJECT = @subject')
            .then(record => {
                return (record.rowsAffected[0] === 0) ? null : args;
            });
    };

    this.delTeacher = (args, context) => {
        return (new mssql.Request())
            .input('teacher', mssql.NVarChar, args.TEACHER)
            .query('delete from TEACHER where TEACHER = @teacher')
            .then(record => {
                return record.rowsAffected[0] == 0 ? null : args;
            });
    };




    // =======================  CONNECT  =======================

    this.connect = mssql.connect(config, err => {
        err ? callBack(err, null) : callBack(null, this.connect);
    });
}




exports.DB = callBack => new DB(callBack);