var pg = require('pg');
var sanitizer = require('sanitizer');

var conString = 'postgres://admin:admin@localhost:5432/polaroid';


exports.login = function(username, password, callback) {
	username = sanitizer.sanitize(username);
	password = sanitizer.sanitize(password);

	pg.connect(conString, function (err, client, done)  {
		var query = client.query('select func_verify_user($1, $2) as retval', [username, password], function (err, result) {
			if(err) {
				callback(err);
				done();
			} else {
				//console.log('%s', result.rows[0].retval);
				callback(null, result);
				done(); // Wichtig sonst werden Clients geleakt.
			}
		});
	});
};

exports.signUp = function(first, last, user, mail, password, callback) {
	first = sanitizer.sanitize(first);
	last = sanitizer.sanitize(last);
	user = sanitizer.sanitize(user);
	mail = sanitizer.sanitize(mail);
	password = sanitizer.sanitize(password);

	pg.connect(conString, function (error, client, done) {
		var query = client.query('select func_register_user($1, $2, $3, $4, $5) as retval', [mail, password, user, first, last], function (error, result) {
			if (error) {
				callback(error, null);
				done();
			} else {
				callback(null, result);
				done();
			}
		});
	});
};

exports.checkUser = function (username, password, callback) {
	username = sanitizer.sanitize(username);
	password = sanitizer.sanitize(password);

	pg.connect(conString, function (error, client, done) {
		var query = client.query('select func_verify_user_cookie($1, $2) as retval', [username, password], function (error, result) {
			if (error) {
				callback(error, null);
				done();
			} else {
				callback(null, result);
				done();
			}
		});
	});
};

exports.getUserByMail = function(mail, callback){
	mail = sanitizer.sanitize(mail);

	pg.connect(conString, function(error, client, done){
		var query = client.query('select * FROM func_get_user_by_mail($1)', [mail], function(error, result){
			if (error){
				callback(error, null);
				done();
			}else{
				callback(null, result);
				done();
			}
		});
	});
}

exports.changePassword = function(password, id, callback){
	password = sanitizer.sanitize(password);
	id = sanitizer.sanitize(id);

	pg.connect(conString, function(error, client, done){
		var query = client.query('select func_change_password($1, $2) as retval', [password, id], function (error, result){
			if (error){
				callback(error, null);
				done();
			}else{
				callback(null, result);
				done();
			}
		});
	});
};

exports.checkOAuth = function(oauth, callback){
	oauth = sanitizer.sanitize(oauth);

	pg.connect(conString, function(error, client, done){
		var query = client.query('select func_verify_oauth($1) as retval', [oauth], function(error, result){
			if (error){
				callback(error, result);
				done();
			}else{
				callback(null, result);
				done();
			}
		});
	});
};

exports.signUpOAuth = function(first, last, user, mail, oauth, callback) {
	first = sanitizer.sanitize(first);
	last = sanitizer.sanitize(last);
	user = sanitizer.sanitize(user);
	mail = sanitizer.sanitize(mail);
	oauth = sanitizer.sanitize(oauth);

	pg.connect(conString, function (error, client, done) {
		var query = client.query('select func_register_user_oauth($1, $2, $3, $4, $5) as retval', [mail, user, first, last, oauth], function (error, result) {
			if (error) {
				callback(error, null);
				done();
			} else {
				callback(null, result);
				done();
			}
		});
	});
};

//Test
exports.login('testuser', 'password', function(e) {
	//console.log(e);
});
