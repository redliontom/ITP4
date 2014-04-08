var DB = require('./modules/DB');
var fs = require('fs');

function login (request, response)
{
	try {
		var username = request.body.username;
		var password = request.body.password;

		DB.login(username, password, function (error, result) {
			if(error) {
				rememberext(request, response);
			} else {
				if(result.rows[0].retval != "null") {
					if (request.body.remember) {
						response.cookie('polaroidRememberUser', username);
						response.cookie('polaroidRememberHash', result.rows[0].retval);
					}
					request.session.polaroidUser = username;
					request.session.polaroidHash = result.rows[0].retval;
					response.redirect(301, '/account');
				} else {
					rememberext(request, response);
				}
			}
		});
	} catch (e) {
		rememberext(request, response);
	}
};

function signup (request, response)
{
	var body = request.body;

	DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
		if (error) {
			rememberext(request, response);
		} else {
			// TODO: send confirmation mail
			login(request, response);
		}
	});
};

function forgot (request, response)
{
	// TODO: sende mail udgl
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
	request.session = null;
	response.clearCookie('polaroidRememberUser');
	response.clearCookie('polaroidRememberHash');
	response.redirect(301, '/');
};

function remember (request, response)
{
	try {
		checkUser(request, response, request.cookies.polaroidRememberUser, request.cookies.polaroidRememberHash);
	} catch (e1) {
		try {
			checkUser(request, response, request.session.polaroidUser, request.session.polaroidHash);
		} catch (e2) {
			console.log('nothing');
		}
	}
};

function rememberext (request, response)
{
	try {
		checkUser(request, response, request.cookies.polaroidRememberUser, request.cookies.polaroidRememberHash);
	} catch (e1) {
		try {
			checkUser(request, response, request.session.polaroidUser, request.session.polaroidHash);
		} catch (e2) {
			response.set('error', 1);
			response.redirect(301, '/');
		}
	}
};

function checkUser (request, response, username, password)
{
	if (!username || !password) {
		throw "error";
	}

	DB.checkUser(username, password, function (error, result) {
		if (error) {
			logfile('error.log', error);
			//response.redirect(301, '/');
		} else {
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

/*
function call(request, response)
{
	console.log(request.url);
	switch (request.url) {
	case '/':
		login(request, response);
		break;
	case '/account/signup/':
		signup(request, response);
		break;
	case '/account/forgot/':
		forgot(request, response);
		break;
	default:
		rememberext(request, response);
		break;
	}
};

function link(request, response)
{
	switch (request.url) {
	case '/forgot-link':
		linkForgot(request, response);
		break;
	case '/create-link':
		linkCreate(request, response);
		break;
	case '/login-link':
		linkLogin(request, response);
		break;
	case '/logout-link':
		linkLogout(request, response);
		break;
	default:
		break;
	}
};

exports.routing = function (request, response) {
	call(request, response);
	link(request, response);
};
*/

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
