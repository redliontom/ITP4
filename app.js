var express = require('express');
var http = require('http');
var app = express();
var path = __dirname + '/App/public';
var routing = require('./App/routing');

app.configure(function(){
	app.set('port', 8080);
	//app.use(express.logger());
	app.use(express.static(path));
	//app.use(routing.routing);
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: 'polaroid'
	}));
	app.use(app.router);
});

routing(app);

http.createServer(app).listen(app.get('port'), '127.0.0.1');
console.log('Webserver gestartet');
