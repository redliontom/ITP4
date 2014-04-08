var DB = require('./modules/DB');
var fs = require('fs');

function login (request, response, remember)
{
	loginext(request, response, request.body.username, request.body.password, request.body.remember);
};

function loginext (request, response, username, password, remember)
{
	if (!username || !password) {
		response.redirect(301, '/');
		return;
	}
	checkUser(request, response, username, password, request.cookies.polaroidRemember);
	checkUser(request, response, username, password, request.session.polaroidHash);

	DB.login(username, password, function (error, result) {
		if(error) {
			logfile('error.log', error);
		} else {
			if(result.rows[0].retval != "null") {
				if (remember) {
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

function signup (request, response)
{
	var body = request.body;

	DB.signUp(body.first, body.last, body.user, body.mail, body.password, function (error, result) {
		if (error) {
			response.set('error', 1);
			response.redirect(301, '/');
		} else {
			// TODO: send confirmation mail
			loginext(request, response, body.user, body.password, body.remember);
		}
	});
};

function forgot (request, response)
{
	// TODO: check and send mail
}

function create (request, response)
{
	response.redirect(301, 'account/signup');
};

function directCall (app)
{
	app.post('/', function (request, response) {
		login(request, response);
	});
	app.post('/account/signup', function (request, response) {
		signup(request, response);
	})
	app.post('/account/forgot', function (request, response) {
		forgot(request, response);
	});
};

function virtualLink (app)
{
	app.get('/create', function (request, response) {
		create(request, response);
	});
};

function logfile (path, message)
{
	console.log(error);
	console.log(message);
	return;
	// TODO: vor auslieferung die ersten drei zeilen löschen

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

module.exports = function(app) {
	directCall(app);
	virtualLink(app);
};
