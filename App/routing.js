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

function signup (request, response)
{
	var body = request.body;
	DB.SignUp(body.first, body.last, body.user, body.mail, body.password, function(error, result) {
		// TODO: add signup logic
		response.set('error', 1);
		response.redirect(301, '/');
	});
};

function create (request, response)
{
	response.redirect(301, 'account/signup');
};

module.exports = function(app) {
	app.post('/', function(request, response) {
		login(request, response);
		console.log(request.session);
	});
	app.post('/account/signup', function(request, response) {
		signup(request, response);
	})

	// create button in login screen
	app.get('/create', function(request, response) {
		create(request, response);
	});
};
