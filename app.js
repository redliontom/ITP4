var express = require('express');
var http = require('http');
var app = express();

app.configure(function(){
	app.set('port', 80);
	app.use(express.static(__dirname + '/App/public'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: 'polaroid',
	}));
	app.use(app.router);
});

require('./App/routing')(app);

http.createServer(app).listen(app.get('port'), '127.0.0.1');
console.log('Webserver gestartet');
