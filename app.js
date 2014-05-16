var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
var path = __dirname + '/App/public';
var routing = require('./App/routing');


app.configure(function(){
	app.set('port', 8888);
	app.set('https-port', 8383);
	app.set('host', 'localhost');
	//app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: 'polaroid'
	}));
	app.use(app.router);
	app.use(express.static(path));
	/*app.use(function noCachePlease(req, res, next) {
		if (req.url === '/logout-link') {
			res.header("Cache-Control", "no-cache, no-store, must-revalidate");
			res.header("Pragma", "no-cache");
			res.header("Expires", 0);
		}
	});*/

	// https server
	var options = {
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.crt')
	};

	app.set('https-server', https.createServer(options, app).listen(app.get('https-port'), app.get('host')));
});

routing(app);

app.set('http-server', http.createServer(app).listen(app.get('port'), app.get('host')));
console.log('Webserver gestartet');
