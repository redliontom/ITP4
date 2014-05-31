var pg = require('pg');
var sanitizer = require('sanitizer');

var conString = 'postgres://admin:admin@localhost:5432/polaroid';


exports.login = function(username, password, callback) {
	username = sanitizer.sanitize(username);
	password = sanitizer.sanitize(password);

	pg.connect(conString, function (err, client, done) {
		if (err) {
			return callback(err, null);
		}

		var query = client.query('select func_verify_user($1, $2) as retval', [username, password], function (err, result) {
			if(err) {
				callback(err);
				done();
			} else {
				//console.log('%s', result.rows[0].retval);
				callback(null, result.rows[0].retval);
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
		if (error) {
			return callback(error, null);
		}

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

exports.getUserByMail = function(mail, callback){
	mail = sanitizer.sanitize(mail);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		var query = client.query('select * FROM func_get_user_by_mail($1)', [mail], function(error, result){
			if (error){
				callback(error, null);
				done();
			}else{
				callback(null, result.rows);
				done();
			}
		});
	});
}

exports.changePassword = function(password, id, callback){
	password = sanitizer.sanitize(password);
	id = sanitizer.sanitize(id);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		var query = client.query('select func_change_password($1, $2) as retval', [password, id], function (error, result){
			if (error){
				callback(error, null);
				done();
			}else{
				callback(null, result.rows[0].retval);
				done();
			}
		});
	});
};

exports.checkOAuth = function(oauth, callback){
	oauth = sanitizer.sanitize(oauth);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		var query = client.query('select func_verify_oauth($1) as retval', [oauth], function(error, result){
			if (error){
				callback(error, result);
				done();
			}else{
				callback(null, result.rows[0].retval);
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
		if (error) {
			return callback(error, null);
		}

		var query = client.query('select func_register_user_oauth($1, $2, $3, $4, $5) as retval', [mail, user, first, last, oauth], function (error, result) {
			if (error) {
				callback(error, null);
				done();
			} else {
				callback(null, result.rows[0].retval);
				done();
			}
		});
	});
};

exports.createAuthSession = function (username, series, token, callback) {
	username = sanitizer.sanitize(username);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_create_auth_session($1,$2,$3) as retval', [username, series, token], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};

exports.destroyAuthSession = function (username, callback) {
	username = sanitizer.sanitize(username);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_destroy_auth_session($1) as retval', [username], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};

exports.checkAuthSession = function (username, series, token, callback) {
	username = sanitizer.sanitize(username);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_check_auth_session($1,$2,$3) as retval', [username, series, token], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};

exports.savePictureInfos = function (username, name, directory, flash, aperture, exposure_time, focal_distance, iso, callback){
	username = sanitizer.sanitize(username);
	name = sanitizer.sanitize(name);
	directory = sanitizer.sanitize(directory);
	flash = sanitizer.sanitize(flash);
	aperture = sanitizer.sanitize(aperture);
	exposure_time = sanitizer.sanitize(exposure_time);
	focal_distance = sanitizer.sanitize(focal_distance);
	iso = sanitizer.sanitize(iso);

	pg.connect(conString, function(error, client, done){
		if (error){
			return callback(error, null);
		}

		client.query('select func_save_picture_infos($1, $2, $3, $4, $5, $6, $7, $8) as retval', 
			[username, name, directory, flash || false, aperture || null, exposure_time || null, focal_distance || null, iso || null], function(error, result){
				done();

				if (error){
					return callback(error, null);
				}

				callback(null, result.rows[0].retval);
			})
	});
};

//Test
/*exports.login('testuser', 'password', function(e) {
	//console.log(e);
});*/
