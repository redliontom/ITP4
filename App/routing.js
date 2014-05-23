var DB = require('./modules/DB');
var fs = require('fs');
var crypto = require('crypto');
var mail = require("nodemailer");
var readline = require('readline');
var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

module.exports = function (app) {
	// html
	app.route('/')
	.all(redirectToHttps, checkAuthSession, login, function (request, response) {
		response.status(200).sendfile('./App/public/index.html');
	});
	app.route('/account')
	.all(redirectToHttps, checkAuthSession, account, function (request, response) {
		response.status(200).sendfile('./App/public/account/index.html');
	});
	app.route('/account/signup')
	.all(redirectToHttps, checkAuthSession, signup, function (request, response) {
		response.status(200).sendfile('./App/public/account/signup/index.html');
	});
	app.route('/account/forgot')
	.all(redirectToHttps, checkAuthSession, forgot, function (request, response) {
		response.status(200).sendfile('./App/public/account/forgot/index.html');
	});
	app.route('/account/reset')
	.all(redirectToHttps, checkAuthSession, reset, function (request, response) {
		response.status(200).sendfile('./App/public/account/reset/index.html');
	});
	app.route('/gpauth')
	.all(redirectToHttps, checkAuthSession, oauth, function (request, response) {
		response.status(200).sendfile('./App/public/account/index.html');
	});

	// link
	app.route('/logout').all(redirectToHttps, logout);
};

function logfile(path, message) {
	return console.log(path + ': ' + message);
	// TODO: vor Auslieferung das return löschen

	fs.open(path, 'a', 0666, function (error, fd) {
		if (error) {
			console.log(error);
			console.log(message);
		} else {
			var buffer = new Buffer(message + '\n', 'utf8');
			fs.writeSync(fd, buffer, 0, buffer.length, null);
		}
	});
}

function createUserDir(username) {
	// __dirname = <workingdir>/App
	fs.mkdir(__dirname + '/' + username, 0660, function (error) {
		if (error) {
			logfile('error.log', error);
		} else {
			logfile('info.log', 'created new user \'' + username + '\'');
		}
	});
}

function redirectToHttps(request, response, next) {
	console.log('redirectToHttps');
	// no cache
	response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	response.set('Pragma', 'no-cache');

	// TODO: Nächste Zeile löschen und die Kommentare ab 'if' löschen sodass zu 'https' weitergeileitet wird.
	return next();

	/*if (request.secure) {
		next();
	} else {
		if (request.host == 'localhost' || request.host == '127.0.0.1') {
			response.redirect('https://' + request.host + ':' + app.get('port') + request.path);
		} else {
			response.redirect('https://' + request.host + request.path);
		}
	}*/
}

function checkAuthSession(request, response, next) {
	console.log('checkAuthSession');
	var cookies = request.cookies;

	if (request.session.username) {
		if (request.path != '/account') {
			response.redirect('/account');
		} else {
			return next();
		}
	} else if (cookies.username && cookies.series && cookies.token) {
		DB.checkAuthSession(cookies.username, cookies.series, cookies.token, function (error, result) {
			if (error) {
				return response.redirect('/');
			} else if (result) {
				request.session.username = cookies.username;
				
				if (request.path != '/account') {
					response.redirect('/account');
				} else {
					return next();
				}
			} else {
				return response.redirect('/');
			}
		});
	} else if (request.path == '/') {
		return next();
	} else {
		response.redirect('/');
	}
}

function createAuthSession(request, response, next, username, cookie) {
	console.log('createAuthSession');

	var sha1 = crypto.createHash('sha1');

	// TODO: Node.js wird die Crypto API sehr wahrscheinlich umschreiben. Bei Updates muss darauf geachtet werden.
	crypto.randomBytes(512, function (error, result) {
		console.log('series');
		if (error) {
			logfile('error.log', '"' + username + '" ' + error);
			return next(); // TODO: Sende error an den client
		}

		sha1.update(result, 'binary');
		var series = sha1.digest('hex');

		crypto.randomBytes(512, function (error, result) {
			console.log('token');
			if (error) {
				logfile('error.log', '"' + username + '" ' + error);
				return next(); // TODO: Sende error an den client
			}

			sha1 = crypto.createHash('sha1');
			sha1.update(result, 'binary');
			var token = sha1.digest('hex');

			DB.createAuthSession(username, series, token, function (error, result) {
				console.log('DB');
				if (error) {
					logfile('error.log', '"' + username + '" ' + error);
					return next(); // TODO: Sende error an den client
				}

				var date = new Date(Date.now());
				date.setFullYear(date.getFullYear() + 10);

				if (cookie && result) {
					// TODO: Cookie option 'secure' auf TRUE setzen sobald HTTPS funktioniert.
					response.cookie('username', username, { expires: date, signed: true/*, secure: true*/ });
					response.cookie('series', series, { expires: date, signed: true/*, secure: true*/ });
					response.cookie('token', token, { expires: date, signed: true/*, secure: true*/ });
				}

				request.session.username = username;
				return response.redirect('/account');
			});
		});
	});
}

function destroyAuthSession(request, response) {
	DB.destroyAuthSession(request.session.username, function (error, result) {
		if (error) {
			logfile('error.log', error);
		}

		request.session = null;
		response.redirect('/');
	});
}

function login(request, response, next) {
	console.log('login');

	try {
		if (request.body && request.body.username && request.body.password) {
			DB.login(request.body.username, request.body.password, function (error, result) {
				if (error) {
					logfile('error.log', error);
					return next();
				} else {
					if (result != "null") {
						createAuthSession(
							request,
							response,
							next,
							request.body.username,
							request.body.remember);
						logfile('info.log', 'user \'' + request.body.username + '\' logged in');
					} else {
						logfile('info.log', 'user \'' + request.body.username + '\' tried to login');
						return next();
					}
				}
			});
		} else {
			return next();
		}
	} catch (e) {
		logfile('error.log', e);
		return next();
	}
}

function logout(request, response, next) {
	return destroyAuthSession(request, response);
}

function account(request, response, next) {
	// TODO: Accountdaten übertragen wenn der Login passt.
	console.log('account');
	return next();
}

function signup(request, response, next) {
	console.log('signup');
	var body = request.body;

	try {
		if (body && body.first && body.last && body.user && body.mail && body.password) {
			DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
				if (error) {
					return next();
				} else {
					createUserDir(body.user);
					response.redirect('/account');
				}
			});
		} else {
			return next();
		}
	} catch (e) {
		logfile('error.log', e);
		return next();
	}
}

function forgot(request, response, next) {
	console.log('forgot');

	try {
		//Pickup transport method saves mail to a local directory
		var transport = mail.createTransport("PICKUP", {
			directory: require('path').dirname(require.main.filename) + "\\mails"
		});

		var body = request.body;

		if (body && body.mail) {
			DB.getUserByMail(body.mail, function (error, result) {
				if (error) {
					logfile('error.log', error);
				} else {
					console.log(result[0]);
					if (result[0]){
						//Send reset mail
						var domain = null;

						if (request.host == 'localhost' || request.host == '127.0.0.1') {
							domain = request.protocol + '://' + request.host + ':8080';
						} else {
							domain = request.protocol + '://' + request.host;
						}

						var pw = result[0]['password'];
						var key = crypto.createHash('md5').update(pw).digest('hex');
						var mailOptions = {
							from: "noreply@polaroidphotoclub.lu",
							to: result['email'],
							subject: "Password forget!",
							text: 'Follow the link to reset your password: ' + domain + '/account/reset?id=' + result[0]['pk_user'] + '&username' + result[0]['username'] + '=&key=' + key
						}

						transport.sendMail(mailOptions);
						response.redirect('/');
					}else{
						response.redirect('/account/forgot');
					}
				}
			});
		} else {
			return next();
		}
	} catch (e) {
		logfile('error.log', e);
		return next();
	}
}

function reset(request, response, next) {
	console.log('reset');

	//TO-DO: Prüfen der Parameter, um das ändern beliebiger Passwörter zu unterbinden
	try {
		var params = request.query;

		if (params['id']) {
			var body = request.body;

			DB.changePassword(body.password, params.id, function (error, result) {
				if (error) {
					logfile('error.log', error);
					return next();
				}

				response.redirect('/account');
			});
		}else{
			response.redirect('/');
		}
	} catch (e) {
		logilfe('error.log', e);
		return next();
	}
}

function oauth(request, response, next) {
	console.log('oauth');

	var client;

	var clientId = '1024308178797-54unkca3bga8f4palj4fvh6ulibag5mr.apps.googleusercontent.com';
	var clientSecret = 'sKGpMy0gSNXtCFJj-PMSBzZU';
	var redirectUrl = 'postmessage';
	var scope = 'https://www.googleapis.com/auth/plus.login';

	googleapis
		.discover('plus', 'v1')
		.execute(function (err, data) {
			client = data;
		});

	var oauth2 = new googleapis.OAuth2Client(clientId, clientSecret, redirectUrl);

	oauth2.getToken(request.body.code, function (err, tokens) {
		oauth2.credentials = tokens;
		client.plus.people.get({
			userId: 'me'
		}).withAuthClient(oauth2)
		  .execute(function (err, gpResult) {
		  	if (gpResult) {
		  		DB.checkOAuth(gpResult.id, function (error, result) {
		  			if (error) {
		  				logfile('error.log', error);
		  				return next();
		  			} else {
		  				if (result == 1) {
		  					createAuthSession(request, response, next, gpResult.nickname, true);
		  					logfile('info.log', 'user \'' + gpResult.nickname + '\' logged in via google');

		  				} else {
		  					DB.signUpOAuth(gpResult.name.givenName, gpResult.name.familyName, gpResult.nickname, gpResult.emails, gpResult.id, function (error, result) {
		  						if (error) {
		  							return next();
		  						} else {
		  							createAuthSession(request, response, next, gpResult.nickname, true);
		  							logfile('info.log', 'user \'' + gpResult.nickname + '\' logged in via google');
		  						}
		  					});
		  				}
		  			}
		  		});
		  	} else {
		  		logfile('error.log', err);
		  		return next();
		  	}
		  });
	});
}
