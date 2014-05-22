var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');
var app = express();
var path = __dirname + '/App/public';
var routing = require('./App/routing');

var sha1 = crypto.createHash('sha1');

sha1.update('polaroid luxembourg photo club');

app.set('port', 8080);
app.set('host', 'localhost');

//app.use(express.logger());
app.use(require('body-parser')());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
	secret: sha1.digest('hex')
}));
//app.use(app.router);

// https server
var options = {
	key: fs.readFileSync('./cert/server.key'),
	cert: fs.readFileSync('./cert/server.crt')
};
	
routing(app);
app.use(express.static(path));
app.set('https-server', https.createServer(options, app).listen(43443, app.get('host')));
app.set('http-server', http.createServer(app).listen(8080, app.get('host')));
console.log('Webserver gestartet');
