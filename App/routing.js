var DB = require('./modules/DB');
var fs = require('fs');

module.exports = function(app) {
	app.post('/', function (request, response) {
		login(request, response);
	});
	app.get('/account', function (request, response) {
		console.log('account req');
		rememberext (request, response);
	});
	app.post('/account/signup', function (request, response) {
		signup(request, response);
	})
	app.post('/account/forgot', function (request, response) {
		forgot(request, response);
	});

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

function login (request, response)
{
	console.log('login');
	try {
		var username = request.body.username;
		var password = request.body.password;

		DB.login(username, password, function (error, result) {
			if(error) {
				console.log('error');
				//rememberext(request, response);
			} else {
				if(result.rows[0].retval != "null") {
					console.log('success');
					if (request.body.remember) {
						response.cookie('polaroidRememberUser', username);
						response.cookie('polaroidRememberHash', result.rows[0].retval);
					}
					request.session.polaroidUser = username;
					request.session.polaroidHash = result.rows[0].retval;
					response.redirect( '/account');
				} else {
					console.log('failure');
					response.redirect( '/');
				}
			}
		});
	} catch (e) {
		response.redirect( '/');
	}
};

function signup (request, response)
{
	console.log('signup');
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
	response.redirect('/account/forgot');
}

function linkCreate (request, response)
{
	response.redirect('/account/signup');
};

function linkLogin (request, response)
{
	console.log('linklogin');
	response.redirect('/');
};

function linkLogout (request, response)
{
	console.log('linklogout');
	request.session = null;
	response.cookie('polaroidRememberUser', null);
	response.cookie('polaroidRememberHash', null);
	response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	response.redirect( '/');
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
	console.log('rememberext');
	try {
		checkUser(request, response, request.cookies.polaroidRememberUser, request.cookies.polaroidRememberHash);
	} catch (e1) {
		try {
			checkUser(request, response, request.session.polaroidUser, request.session.polaroidHash);
		} catch (e2) {
			response.set('error', 1);
			response.redirect( '/');
		}
	}
};

function checkUser (request, response, username, password)
{
	console.log('checkuser');
	if (!username || !password) {
		throw "error";
	}

	DB.checkUser(username, password, function (error, result) {
		if (error) {
			logfile('error.log', error);
			//response.redirect( '/');
		} else if(result.rows[0].retval != "null"){
			response.status(200).sendfile('./App/public/account/index.html');
		} else {
			response.redirect( '/');
		}
	});
};

function logfile (path, message)
{
	console.log('logfile');
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
