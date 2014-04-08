var DB = require('./modules/DB');
var fs = require('fs');

function initial (request, response)
{
	console.log('initialCall');
	checkUser(request, response, username, password, request.cookies.polaroidRemember);
	checkUser(request, response, username, password, request.session.polaroidHash);
};

function login (request, response)
{
	var username = request.body.username;
	var password = request.body.password;
	var remember = request.body.remember;

	DB.login(username, password, function (error, result) {
		if(error) {
			logfile('error.log', error);
		} else {
			if(result.rows[0].retval != "null") {
				if (remember) {
					logfile('info.log', 'remember');
					response.cookie('polaroidRemember', result.rows[0].retval);
				}
				request.session.polaroidUser = username;
				request.session.polaroidHash = result.rows[0].retval;
				response.redirect(301, '/account');
			} else {
				response.set('error', 1);
				response.redirect(301, '/');
			}
		}
	});
};

function signup (request, response)
{
	var body = request.body;

	DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
		if (error) {
			response.set('error', 1);
			response.redirect(301, '/');
		} else {
			// TODO: send confirmation mail
			login(request, response);
		}
	});
};

function linkForgot (request, response)
{
	response.redirect(301, 'account/forgot');
}

function linkCreate (request, response)
{
	response.redirect(301, 'account/signup');
};

function linkLogin (request, response)
{
	response.redirect(301, '/');
};

function linkLogout (request, response)
{
	request.session.destroy(function () {
		response.redirect(301, '/');
	});
};

function checkUser (request, response, username, password, value)
{
	DB.checkUser(username, password, function (error, result) {
		if (error) {
			logfile('error.log', error);
			response.redirect(301, '/');
		} else if (result == value) {
			response.redirect(301, '/account');
		}
	});
};

function logfile (path, message)
{
	console.log(message);
	return;
	// TODO: vor auslieferung die ersten zwei zeilen löschen

	fs.open('error.log', 'a', 0666, function (error, fd) {
		if (error) {
			console.log(error);
			console.log(message);
		} else {
			var buffer = new Buffer(message + '\n', 'utf8');
			fs.writeSync(fd, buffer, 0, buffer.length, null);
		}
	});
};

function directCall (app)
{
	app.all('/', function (request, response) {
		login(request, response);
	});
	app.all('/account/signup', function (request, response) {
		signup(request, response);
	})
	app.all('/account/forgot', function (request, response) {
		forgot(request, response);
	});
};

function virtualLink (app)
{
	app.all('/forgot-link', function (request, response) {
		linkForgot(request, response);
	});
	app.all('/create-link', function (request, response) {
		linkCreate(request, response);
	});
	app.all('/login-link', function (request, response) {
		linkLogin(request, response);
	});
	app.all('/logout-link', function (request, response) {
		linkLogout(request, response);
	});
};

module.exports = function(app) {
	directCall(app);
	virtualLink(app);
};
