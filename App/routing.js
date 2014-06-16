var DB = require('./modules/DB');
var fs = require('fs');
var crypto = require('crypto');
var mail = require("nodemailer");
var readline = require('readline');
var imagemagick = require('imagemagick');
var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

module.exports = function (app) {
	// Login
	app.route('/')
	.all(redirectToHttps, checkAuthSession, login, function (request, response) {
		response.status(200).sendfile('./App/public/index.html');
	});

	// Signup
	app.route('/account/signup')
	.all(redirectToHttps, signup, function (request, response) { // Es wird keine Authentifizierung vorgenommen
		response.status(200).sendfile('./App/public/account/signup/index.html');
	});

	// Forgot
	app.route('/account/forgot')
	.all(redirectToHttps, forgot, function (request, response) { // Es wird keine Authentifizierung vorgenommen
		response.status(200).sendfile('./App/public/account/forgot/index.html');
	});

	// Reset
	app.route('/reset')
	.all(redirectToHttps, reset, function (request, response) {
		response.status(200).sendfile('./App/public/reset/index.html');
	});


	// Settings
	app.route('/account/settings')
	.all(redirectToHttps, checkAuthSession)
	.post(changeName, changeMail, changePassword, changePrivacy, sendSettings, function (request, response) {
		response.redirect('/account');
	})
	.get(function (request, response) {
		response.redirect('/account');
	});

	// Upload
	app.route('/account/upload')
	.all(redirectToHttps, checkAuthSession)
	.post(upload, function (request, response) {
		response.redirect('/account');
	})
	.get(function (request, response) {
		response.redirect('/account');
	});

	// Account
	app.route('/account')
	.all(redirectToHttps, checkAuthSession, account, function (request, response) {
		response.status(200).sendfile('./App/public/account/index.html');
	});

	// GPAuth
	app.route('/gpauth')
	.all(redirectToHttps, oauth, function (request, response) {
		response.status(200).sendfile('./App/public/account/index.html');
	});

	// link
	app.route('/logout').all(redirectToHttps, logout);
};

function logfile(path, message) {
	return console.log(message); // TODO: vor Auslieferung das return löschen
	
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
	var path = __dirname + '/public/upload/' + username;

	fs.mkdir(path, 0660, function (error) {
		try {
			fs.mkdirSync(path + '/original', 0660);
			fs.mkdirSync(path + '/small', 0660);

			if (error) {
				logfile('error.log', error);
			} else {
				logfile('info.log', 'created new user \'' + username + '\'');
			}
		} catch (e) {
			logfile('error.log', e);
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
		return next();
	} else {
		response.redirect('https://' + request.host + request.path);
	}*/
}

function checkAuthSession(request, response, next) {
	console.log('checkAuthSession');
	var cookies = request.signedCookies;
	var username = null;
	var series = null;
	var token = null;
	var remember = false;

	if (request.session.username) {
		username = request.session.username;
		series = request.session.series;
		token = request.session.token;
		remember = request.session.remember;
	} else if (cookies.username) {
		username = cookies.username;
		series = cookies.series;
		token = cookies.token;
		remember = true;
	} else {
		if (request.path == '/') {
			return next();
		} else {
			return response.redirect('/');
		}
	}

	DB.checkAuthSession(username, series, token, function (error, result) {
		if (error) {
			logfile('error.log', error);

			if (request.path == '/') {
				return next();
			} else {
				return response.redirect('/');
			}
		} else if (result) {
			createAuthSession(request, response, next, username, remember);
		} else if (request.path == '/') {
			return next();
		} else {
			logfile('error.log', 'unauthorized access via cookie for user "' + username + '"');
			return response.status(403).send('Unauthorized access');
		}
	});
}

function createAuthSession(request, response, next, username, remember) {
	console.log('createAuthSession');

	// INFO: Node.js wird die Crypto API sehr wahrscheinlich umschreiben. Bei Updates muss darauf geachtet werden.
	crypto.randomBytes(128, function (error, result) {
		console.log('series');
		if (error) {
			logfile('error.log', '"' + username + '" ' + error);
			return response.status(500).send('Could not create series');
		}

		var sha1 = crypto.createHash('sha1');
		sha1.update(result, 'binary');
		var series = sha1.digest('hex');

		crypto.randomBytes(128, function (error, result) {
			console.log('token');
			if (error) {
				logfile('error.log', '"' + username + '" ' + error);
				return response.status(500).send('Could not create token');
			}

			sha1 = crypto.createHash('sha1');
			sha1.update(result, 'binary');
			var token = sha1.digest('hex');

			DB.createAuthSession(username, series, token, function (error, result) {
				console.log('DB');
				if (error) {
					logfile('error.log', '"' + username + '" ' + error);
					return response.status(500).send('Could not verify user through database');
				}

				var date = new Date(Date.now());
				date.setFullYear(date.getFullYear() + 10);

				if (result) {
					if (remember) {
						// TODO: Cookie option 'secure' auf TRUE setzen sobald HTTPS funktioniert.
						response.cookie('username', username, { expires: date, signed: true/*, secure: true*/ });
						response.cookie('series', series, { expires: date, signed: true/*, secure: true*/ });
						response.cookie('token', token, { expires: date, signed: true/*, secure: true*/ });
					}

					request.session.username = username;
					request.session.series = series;
					request.session.token = token;
					request.session.remember = remember;

					if (request.path.indexOf('/account') != -1) {
						if (request.path.indexOf('/signup') != -1 || request.path.indexOf('/forgot') != -1) {
							return response.redirect('/account');
						} else {
							return next();
						}
					} else {
						return response.redirect('/account');
					}
				} else {
					logfile('error.log', 'unauthorized access via session for user "' + username + '"');
					return response.status(403).send('Unauthorized access');
				}
			});
		});
	});
}

function destroyAuthSession(request, response) {
	DB.destroyAuthSession(request.session.username, function (error, result) {
		if (error) {
			logfile('error.log', error);
		}

		response.clearCookie('username');
		response.clearCookie('series');
		response.clearCookie('token');
		request.session = null;

		response.redirect('/');
	})
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
					return response.status(200).send('Username is not valid');
				} else {
					createUserDir(body.user);
					createAuthSession(request, response, next, body.user, false);
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
		// Gmail Transport Method bis ein Webserver vorhanden ist
		var transport = mail.createTransport("SMTP", {
			service: "Gmail",
		    auth: {
		        user: "photoclubpolaroid@gmail.com",
		        pass: "4ptiv0t0#klup"
		    }
		});

		var body = request.body;

		if (body && body.mail) {
			DB.getUserByMail(body.mail, function (error, result) {
				if (error) {
					logfile('error.log', error);
				} else {
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
							from: "Polaroid Photo Club <noreply@polaroidphotoclub.lu>",
							to: result[0]['email'],
							subject: "Password forgot!",
							text: 'Follow the link to reset your password: ' + domain + '/reset?id=' + result[0]['pk_user'] + '&username=' + result[0]['username'] + '&key=' + key
						}

						transport.sendMail(mailOptions, function(error, response){
							if (error){
								logfile('error.log', error);
							}else{
								console.log ("Message successful send!");
							}
						});	

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

	try {
		var params = request.query;

		// Zugang zum PW-Reset nur, wenn alle Get-Parameter der Mail vorhanden sind.
		if (params.id && params.key && params.username){

			// Wenn Sendmethode POST ist und Passwort gültig
			if (request.method == 'POST' && request.body.password == request.body.confirmpassword){

				// Passwort aus der Datenbank holen, hashen und mit Key vom Get-Parameter abgleichen.
				DB.verifyChangePassword(params.id, params.username, function(error, result){

					var key = crypto.createHash('md5').update(result).digest('hex');
					if (params.key == key){
						var body = request.body;

						// Alles in Ordnung -> Passwort ändern
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
				});
			// Wenn Methode GET, oder das PW ungültig nur die Resetpage anzeigen
			}else{
				response.status(200).sendfile('./App/public/reset/index.html');
			}	
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

	var clientId = '834016996628-0cnmggv39imegd1mvveu7qmh8aesm93k.apps.googleusercontent.com';
	var clientSecret = 'Bv-fpD5IQDNikoWZialWZo9j';
	var redirectUrl = 'http://localhost:8080/gpauth';
	var scope = 'https://www.googleapis.com/auth/plus.login';

	googleapis
		.discover('plus', 'v1')
		.execute(function (err, data) {
			client = data;
		});

	var oauth2 = new googleapis.OAuth2Client(clientId, clientSecret, redirectUrl);
	oauth2.getToken(request.query.code, function (err, tokens) {
		if (!err){
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
			  					logfile('info.log', 'user \'' + gpResult.nickname + '\' logged in via google');
			  					createAuthSession(request, response, next, gpResult.nickname, true);		  					
			  				} else {
			  					DB.signUpOAuth(gpResult.name.givenName, gpResult.name.familyName, gpResult.nickname, gpResult.emails[0].value, gpResult.id, function (error, result) {
			  						if (error) {
			  							logfile('error.log', error);
			  							return next();
			  						} else {
			  							createAuthSession(request, response, next, gpResult.nickname, true);
			  							logfile('info.log', 'user \'' + gpResult.nickname + '\' signedup in via google');
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
		}else{
			logfile('error.log', err);
			return next();
		}
	});
}

function upload(request, response, next) {
	console.log('upload');

	var path = __dirname + '/public/upload/' + request.session.username;

	try {
		var body = request.body;
		var files = request.files;

		if (body && files && files.picture) {			
		//if (body && body.picture && body.title) {
			var picture = files.picture;
			//var picture = body.picture;

			var filename = randomString(8) + "_" + picture.name;
			var title = body.title;
			var camery = body.camera;
			var focal = body.focal;
			var exposure = body.exposure;
			var aperture = body.aperture;
			var iso = body.iso;

			if (picture.size <= 0) {
				logfile('error.log', 'file size of picture "' + picture.name + '" is zero');

				return response.send(406, {
					message: 'File size could not be validated'
				});
			} else if (!title) {
				logfile('error.log', 'No image title');
				return response.status(406).send('Picture title could not be validated');
			}

			switch (picture.type) {
				case 'image/jpeg':
				case 'image/png':
					DB.savePictureInfos(request.session.username, title, filename, 0, aperture, exposure, focal, iso, function (error, result) {
						if (error) {
							logfile('error.log', error);
							return response.status(500).send('Invalid image data');
						} else {
							fs.rename(picture.path, path + '/original/' + filename);
							imageResizeCrop(path, filename, function (error) {
								if (error) {
									logfile('error.log', error);
									return response.status(500).send('Could not resize image');
								}

								//response.status(200).send('Upload successful');
								return response.status(200).redirect('/account');
							});
						}
					});
					break;
				default:
					logfile('error.log', 'invalid MIME type "' + picture.type + '" for user "' + request.session.username + '"');
					return response.status(403).send('Tried to upload invalid MIME-Type "' + picture.type + '".');
			}
		} else {
			return response.status(406).send('No title and/or image provided');
		}
	} catch (e) {
		logfile('error.log', e);

		return response.status(500).send('Could not load picture');
	}
}

// Hilfsfunktion, um einen zufälligen String zu generieren
function randomString(count){
	var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";

	var rnd = crypto.randomBytes(count),
		value = new Array(count),
		len = chars.length;

	for (var i = 0; i < count; i++){
		value[i] = chars[rnd[i] % len];
	}

	return value.join('');
}

/*
Funktion kapselt die Resize und Crop Funktion.

Der Grund ist dass man den Code auswechseln kann ohne die Uploadlogik ansich zu ändern.
Falls zb ein anderes Tool wie derzeit ImageMagick verwendet werden soll, dann kann man
dies tun indem man einfach den nachfolgenden Code ändert.

\param path Pfad zum User-Folder
\param filename Der derzeitige Dateiname des Bildes
\param callback Funktion wird bei Fehler oder Erfolg aufgerufen. function (error) { ... }
 */
function imageResizeCrop(path, filename, callback)
{
	var original = path + '/original/' + filename;
	var small = path + '/small/' + filename;

	imagemagick.convert([original, '-set', 'option:size', '%[fx:min(w,h)]x%[fx:min(w,h)]',
		'xc:none', '+swap', '-gravity', 'center', '-composite', small], function (error, stdout, stderr) {
			if (error && error != 'Error: Command failed: ') {
				logfile('error.log', error);
				return callback(error);
			}

			imagemagick.convert([small, '-resize', '128', small], function (error, stdout, stderr) {
				if (error && error != 'Error: Command failed: ') {
					logfile('error.log', error);
					return callback(error);
				}

				return callback();
			});
	});
}

function changeName(request, response, next) {
	console.log('changeName');
	var body = request.body;

	if (body) {
		if (body.forename && body.surname) {
			return DB.changeUserName(request.session.username, body.forename, body.surname, function (error, result) {
				if (error) {
					logfile('error.log', error);
					return response.status(500).send('Could not change name');
				} else if (result) {
					return response.status(200).send('Success');
				} else {
					logfile('error.log', 'Invalid username: ' + request.session.username);
					return response.status(406).send('Could not verify username');
				}
			});
		} else {
			return next();
		}
	} else {
		return next();
	}
}

function changeMail(request, response, next) {
	console.log('changeMail');
	var body = request.body;

	if (body) {
		if (body.mail) {
			return DB.changeUserMail(request.session.username, body.mail, function (error, result) {
				if (error) {
					logfile('error.log', error);
					return response.status(500).send('Please provide a valid email address!');
				} else if (result) {
					return response.status(200).send('Success');
				} else {
					logfile('error.log', 'Invalid username: ' + request.session.username);
					return response.status(406).send('Could not verify username');
				}
			});
		} else {
			return next();
		}
	} else {
		return next();
	}
}

function changePassword(request, response, next) {
	console.log('changePassword');
	var body = request.body;

	if (body) {
		if (body.old_password && body.new_password_1 && body.new_password_2) {
			return DB.changeUserPassword(request.session.username, body.old_password, body.new_password_1, body.new_password_2, function (error, result) {
				if (error) {
					logfile('error.log', error);
					return response.status(500).send('Could not change password');
				} else if (result) {
					return response.status(200).send('Success');
				} else {
					logfile('error.log', 'Invalid username and/or password: ' + request.session.username);
					return response.status(406).send('Could not verify username');
				}
			});
		} else {
			return next();
		}
	} else {
		return next();
	}
}

function changePrivacy(request, response, next) {
	// TODO: alles!!!
	return next();
}

function sendSettings(request, response, next) {
	console.log('sendSettings');
	DB.sql('select forename, surname, email, status from public.user where username=\'' + request.session.username + '\'', function (error, result) {
		if (error) {
			return response.status(500).send('Could not read from database');
		} else if (result.length > 1) {
			return response.status(500).send('Result is not definite');
		}

		var row = result[0];

		return response.status(200).send({
			forename: row.forename,
			surname: row.surname,
			mail: row.email,
			status: row.status
		})
	});
}
