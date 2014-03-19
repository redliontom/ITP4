var express = require('express');
var http = require('http');
var app = express();

app.configure(function(){
	app.set('port', 8080);
	app.use(express.static(__dirname + '/App/public'));
});

http.createServer(app).listen(app.get('port'), '127.0.0.1');
console.log('Webserver gestartet');
