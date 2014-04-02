var pg = require('pg');

var conString = 'postgres://admin:admin@localhost:5432/polaroid';


exports.Login = function(username, password, callback)
{
	pg.connect(conString, function(err, client, done)  {
		var query = client.query('select func_verify_user($1, $2) as retval', [username, password], function(err, result) {
			if(err) {
				callback(err);
				return;
			} else {
				console.log('%s', result.rows[0].retval);
				callback(null, result);
				done(); // Wichtig sonst werden Clients geleakt.
			}
		});
	});
}

exports.SignUp = function(first, last, user, mail, password, callback)
{
	// TODO: add database code
	callback(null, null);
}

//Test
exports.Login('testuser', 'password', function(e) {
	console.log(e);
});
