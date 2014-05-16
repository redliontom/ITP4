var DB = require('./modules/DB');
var fs = require('fs');
var mail = require("nodemailer");
var readline = require('readline');
var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

module.exports = function(app) {
	app.all('*', function (request, response, next) {
		// no cache
		response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		response.set('Pragma', 'no-cache');

		if (request.protocol == 'http') {
			if (app.get('host') == 'localhost') {
				response.redirect('https://' + request.host + ':' + app.get('https-port') + request.path);
			} else {
				response.redirect('https://' + request.host + request.path);
			}
		} else {
			next();
		}
	});

	app.get('/', function (request, response) {
		login(request, response);
	});
	app.post('/', function (request, response) {
		login(request, response);
	});
	app.get('/account', function (request, response) {
		remember(request, response);
	});
	app.post('/account/signup', function (request, response) {
		signup(request, response);
	})
	app.post('/account/forgot', function (request, response) {
		forgot(request, response);
	});
	app.get('/account/reset', function (request, response) {
		linkreset(request, response);
	});
	app.post('/account/reset', function (request, response) {
		linkreset(request, response);
	});
	app.post('/gpauth', function (request, response) {
		oauth(request, response);
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

		if (!username || !password) {
			remember(request, response);
		} else {
			loginext(request, response, username, password);
		}
	} catch (e) {
		remember(request, response);
		console.log('error.log', e);
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
					response.redirect('/');
					logfile('info.log', 'user \'' + username + '\' tried to log in');
				}
			}
		});
	} catch (e) {
		response.status(200).sendfile('./App/public/index.html');
		logfile('error.log', error);
	}
}

function signup (request, response)
{
	var body = request.body;

	DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
		if (error) {
			remember(request, response);
		} else {
			createUserDir(body.user);
			loginext(request, response, body.user, body.password);
		}
	});
};

function forgot (request, response)
{
	//Pickup transport method saves mail to a local directory
	var transport = mail.createTransport("PICKUP",{
	    directory: require('path').dirname(require.main.filename)+"\\mails"
	});

	var body = request.body;
	DB.getUserByMail(body.mail, function(error, result){
		if (error){
			logfile('error.log', error);
		} else {
			//Send reset mail
			var mailOptions = {
			    from: "itp4@mail.at",
			    to: result.rows['email'],
			    subject: "Password forget!",
			    text: 'Follow the link to reset your password: http://127.0.0.1:8888/account/reset?id='+result.rows[0]['pk_user']+'&username'+result.rows[0]['username']+'=&key='+result.rows[0]['password'] 
			}
			transport.sendMail(mailOptions);
		}
	});
};

function linkreset (request, response){
	var params = request.query;
	console.log(params['id']);

	if (params['id']){
		var body = request.body;

		DB.changePassword(body.password, params.id, function (error, result) {
			if (error){
				logfile('error.log', error);
				response.redirect('/');
			}
		});
	}
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
	request.session.polaroidUser = null;
	request.session.polaroidHash = null;
	response.cookie('polaroidRememberUser', null);
	response.cookie('polaroidRememberHash', null);
	//response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	response.redirect('/');
};

function rememberRedirect (request, response)
{
	rememberext(request, response, function (error, result) {
		if (error) {
			response.set('error', 1);
			response.redirect('/');
			logfile('error.log', error);
		} else if (result) {
			response.redirect('/account');
			logfile('info.log', 'user logged in');
		} else {
			response.set('error', 1);
			response.redirect('/');
			logfile('info.log', 'user tried to login');
		}
	});
};

function remember (request, response)
{
	rememberext(request, response, function (error, result) {
		if (error) {
			response.status(200).sendfile('./App/public/index.html'); console.log('error');
			logfile('error.log', error);
		} else if (result) {
			response.status(200).sendfile('./App/public/account/index.html'); console.log('true');
			logfile('info.log', 'user logged in');
		} else {
			response.status(200).sendfile('./App/public/index.html'); console.log('false');
			logfile('info.log', 'user tried to login');
		}
	});
};

function rememberext (request, response, callback)
{
	try {
		checkUser(request.cookies.polaroidRememberUser, request.cookies.polaroidRememberHash, callback);
	} catch (e) {
		try {
			checkUser(request.session.polaroidUser, request.session.polaroidHash, callback);
		} catch (e) {
			callback(e, null);
		}
	}
};

function checkUser (username, password, callback)
{
	if (!username || !password || username == 'undefined' || password == 'undefined') {
		throw new Error("null reference encountered");
	}

	DB.checkUser(username, password, function (error, result) {
		if (error) {
			callback(error, null);
		} else if(result.rows[0].retval != "null") {
			callback(null, true);
		} else {
			callback(null, false);
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

function oauth(request, response){
	var client;

	var clientId = '1024308178797-54unkca3bga8f4palj4fvh6ulibag5mr.apps.googleusercontent.com';
	var clientSecret = 'sKGpMy0gSNXtCFJj-PMSBzZU';
	var redirectUrl = 'postmessage';
	var scope = 'https://www.googleapis.com/auth/plus.login';

	googleapis
		.discover( 'plus', 'v1' )
		.execute( function(err,data){
			client = data;
		});

	var oauth2 = new googleapis.OAuth2Client(clientId, clientSecret, redirectUrl);

	oauth2.getToken(request.body.code, function(err, tokens){
		oauth2.credentials = tokens;
		client.plus.people.get({
			userId: 'me'
		}).withAuthClient(oauth2)
		  .execute(function(err, gpResult){
		  	if (gpResult){
				DB.checkOAuth(gpResult.id, function(error, result){
					if (error){
						logfile('error.log', error);
					}else{
						if (result.rows[0].retval == 1){
							response.cookie('polaroidRememberUser', gpResult.nickname);
							response.cookie('polaroidRememberHash', gpResult.id);

							request.session.polaroidUser = gpResult.nickname;
							request.session.polaroidHash = gpResult.id;
							response.redirect('/account');

							logfile('info.log', 'user \'' + gpResult.nickname + '\' logged in via google');
						}else{
							DB.signUpOAuth(gpResult.name.givenName, gpResult.name.familyName, gpResult.nickname, gpResult.emails, gpResult.id, function (error, result) {
								if (error) {
									remember(request, response);
								} else {
									createUserDir(gpResult.nickname);

									response.cookie('polaroidRememberUser', gpResult.nickname);
									response.cookie('polaroidRememberHash', gpResult.id);

									request.session.polaroidUser = gpResult.nickname;
									request.session.polaroidHash = gpResult.id;
									response.redirect('/account');

									logfile('info.log', 'user \'' + gpResult.nickname + '\' registered via google');
								}
							});
						}
					}
				});
			}else{
				console.log(err);
			}
		});
	});
};
