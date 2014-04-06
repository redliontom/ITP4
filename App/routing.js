var DB = require('./modules/DB');

function login (request, response)
{
	DB.Login(request.body.username, request.body.password, function(error, result) {
		if(error) {
			console.log(error);
		} else {
			if(result.rows[0].retval) {
				request.session.user = result.rows[0].retval;
				response.redirect(301, '/account');
			} else {
				response.set('error', 1);
				response.redirect(301, '/');
			}
		}
	});
};

function loginext (request, response, username, password)
{
	DB.Login(username, password, function(error, result) {
		if(error) {
			console.log(error);
		} else {
			if(result.rows[0].retval) {
				request.session.user = result.rows[0].retval;
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
	DB.SignUp(body.first, body.last, body.user, body.mail, body.password, function(error, result) {
		if (error) {
			response.set('error', 1);
			response.redirect(301, '/');
		} else {
			// TODO: send confirmation mail
			loginext(request, response, body.user, body.password);
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

module.exports = function(app) {
	directCall(app);
	virtualLink(app);
};
