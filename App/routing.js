var DB = require('./modules/DB');
var fs = require('fs');

module.exports = function(app) {
	app.post('/', function (request, response) {
		login(request, response);
	});
	app.get('/account', function (request, response) {
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
	try {
		var username = request.body.username;
		var password = request.body.password;

		DB.login(username, password, function (error, result) {
			if(error) {
				logfile('error.log', error);
			} else {
				if(result.rows[0].retval != "null") {
					if (request.body.remember) {
						response.cookie('polaroidRememberUser', username);
						response.cookie('polaroidRememberHash', result.rows[0].retval);
					}

					request.session.polaroidUser = username;
					request.session.polaroidHash = result.rows[0].retval;
					response.redirect('/account');

					logfile('info.log', 'user \'' + username + '\' logged in');
				} else {
					response.redirect( '/');
				}
			}
		});
	} catch (e) {
		logfile('error.log', error);
		response.redirect( '/');
	}
};

function loginext (request, response, username, password)
{
	try {
		DB.login(username, password, function (error, result) {
			if(error) {
				logfile('error.log', error);
			} else {
				if(result.rows[0].retval != "null") {
					if (request.body.remember) {
						response.cookie('polaroidRememberUser', username);
						response.cookie('polaroidRememberHash', result.rows[0].retval);
					}

					request.session.polaroidUser = username;
					request.session.polaroidHash = result.rows[0].retval;
					response.redirect('/account');

					logfile('info.log', 'user \'' + username + '\' logged in');
				} else {
					response.redirect( '/');
				}
			}
		});
	} catch (e) {
		logfile('error.log', error);
		response.redirect( '/');
	}
}

function signup (request, response)
{
	var body = request.body;

	DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
		if (error) {
			rememberext(request, response);
		} else {
			createUserDir(body.user);
			loginext(request, response, body.user, body.password);
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
	response.redirect('/');
};

function linkLogout (request, response)
{
	request.session = null;
	response.cookie('polaroidRememberUser', null);
	response.cookie('polaroidRememberHash', null);
	response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	response.redirect('/');
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
	} catch (e) {
		try {
			checkUser(request, response, request.session.polaroidUser, request.session.polaroidHash);
		} catch (e) {
			response.set('error', 1);
			response.redirect('/');
		}
	}
};

function checkUser (request, response, username, password)
{
	if (!username || !password) {
		throw new Error("reference null");
	}

	DB.checkUser(username, password, function (error, result) {
		if (error) {
			logfile('error.log', error);
		} else if(result.rows[0].retval != "null") {
			response.status(200).sendfile('./App/public/account/index.html');
		} else {
			response.redirect('/');
		}
	});
};

function createUserDir (username)
{
	// __dirname =  <workingdir>/App
	fs.mkdir(__dirname + '/public/account/users/' + username, 0660, function (error) {
		if (error) {
			logfile('error.log', error);
		} else {
			logfile('info.log', 'created new user \'' + username + '\'');
		}
	});
};

function logfile (path, message)
{
	console.log(path + ': ' + message);
	return;
	// TODO: vor auslieferung die ersten zwei zeilen löschen

	fs.open(path, 'a', 0666, function (error, fd) {
		if (error) {
			console.log(error);
			console.log(message);
		} else {
			var buffer = new Buffer(message + '\n', 'utf8');
			fs.writeSync(fd, buffer, 0, buffer.length, null);
		}
	});
};
