var http = require('http');
var url = require('url');
var fs = require('fs');
const route = 'fact';


var factorial = (x) => 
{
    if (x < 0)
        return "Invalid value!";
    else if (x == 0 || x == 1) 
        return 1; 
    else 
    {
        return (x * factorial(x - 1));
    }
};



function Fact(n, cb)
{
    this.fn = n;
    this.factt = factorial;
    this.fcb = cb;
    this.calc = () => {process.nextTick(() => {this.fcb(null, this.factt(this.fn))})}
}



http.createServer(function(request, response) {
 
    var rc = JSON.stringify({ k: 0 , fact: 0 });
    if (url.parse(request.url).pathname === '/' + route && typeof url.parse(request.url, true).query.k != 'undefined')
    {
            var k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k))
            {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                var facts = new Fact(k, (err, result) => 
                {
                    response.end(JSON.stringify({ k: k, fact: result })); 
                });
                facts.calc();
            }
    }
    else if (url.parse(request.url).pathname === '/')
    {
        rc = fs.readFileSync('./03-03.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(rc);
    }
    else 
        response.end(rc);
}).listen(5000, () => console.log('Server running at localhost:5000'));