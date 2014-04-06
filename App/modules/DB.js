var pg = require('pg');

var conString = 'postgres://admin:admin@localhost:5432/polaroid';


exports.Login = function(username, password, callback)
{
	pg.connect(conString, function (err, client, done)  {
		var query = client.query('select func_verify_user($1, $2) as retval', [username, password], function(err, result) {
			if(err) {
				callback(err);
				return;
			} else {
				//console.log('%s', result.rows[0].retval);
				callback(null, result);
				done(); // Wichtig sonst werden Clients geleakt.
			}
		});
	});
}

exports.SignUp = function(first, last, user, mail, password, callback)
{
	pg.connect(conString, function (error, client, done) {
		// TODO: add XSS and SQL-Injection prevention
		var query = client.query('select func_register_user($1, $2, $3, $4, $5) as retval', [mail, password, user, first, last], function (error, result) {
			if (error) {
				callback(error, null);
				return;
			} else {
				callback(null, result);
				done();
			}
		});
	});
}

//Test
exports.Login('testuser', 'password', function(e) {
	console.log(e);
});
