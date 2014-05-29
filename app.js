var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');

var app = express();
var path = __dirname + '/App/public';
var routing = require('./App/routing');

var sha1 = crypto.createHash('sha1');
var hash = null;
var mb = 1024 * 1024;

sha1.update('polaroid luxembourg photo club'); // TODO: Zeile vor Implementierung abändern.
hash = sha1.digest('hex');

app.set('port', 8080);
app.set('host', 'localhost');

app.use(require('connect-multiparty')({
	uploadDir: __dirname + '/App/temp'
}));
app.use(require('body-parser')({
	limit: 5 * mb
}));
app.use(require('cookie-parser')(hash));
app.use(require('cookie-session')({
	secret: hash
}));
app.use(require('express-session')({
	secret: hash
	/*cookie: { secure: true }*/
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
