const fs = require('fs');


function StaticHandler(directory = './static') {
    this.staticDir = directory;

    this.pathStatic = fileName => `${this.staticDir}${fileName}`;


    // new RegExp(`^\/*[a-zA-Z0-9]*\/[a-zA-Z0-9]+\.${extension}$`).test(fileName);
    this.isStatic = (extension, fileName) => {
        let regex = new RegExp(`^\/.+\.${extension}$`);
        if (fileName != '/favicon.ico') {
            console.log('\n' + fileName);
            console.log(regex.test(fileName));
        }
        return regex.test(fileName);
    }


    this.pipeFile = (req, res, headers) => {
        res.writeHead(200, headers);
        fs.createReadStream(this.pathStatic(req.url)).pipe(res);
    }


    this.sendFile = (req, res, headers) => {
        fs.access(this.pathStatic(req.url), fs.constants.R_OK, err => {
            err ? this.writeHttp404(res) : this.pipeFile(req, res, headers);
        })
    }


    this.writeHttp404 = res => {
        res.statusCode = 404;
        res.statusMessage = 'Resource not found';
        res.end('<h2>[ERROR] 404: Resource not found.</h2>')
    }
}


module.exports = (directory) => new StaticHandler(directory);