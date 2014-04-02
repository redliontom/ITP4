var DB = require('./modules/DB');

function login (request, response)
{
	DB.Login(request.body.username, request.body.password, function(error, result) {
		if(error) {
			console.log(error);
		} else {
			if(result.rows[0].retval) {
				console.log('erfolg');
				response.redirect(301, '/account');
			} else {
				console.log('misserfolg');
				response.set('error', 1);
				response.redirect(301, '/');
			}
		}
	});
};

module.exports = function(app) {
	app.post('/', function(request, response) {
		login(request, response);
	});
};
