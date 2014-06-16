var pg = require('pg');
var sanitizer = require('sanitizer');

var conString = 'postgres://admin:admin@localhost:5432/polaroid';

exports.sql = function (string, callback) {
	string = sanitizer.sanitize(string);

	if (!string) {
		return callback(new Error('Empty string provided'), null);
	}

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query(string, function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows);
		});
	});
}

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

exports.verifyChangePassword = function(id, username, callback){
	id = sanitizer.sanitize(id);
	username = sanitizer.sanitize(username);
	
	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		var query = client.query('select func_verify_change_password($1, $2) as retval', [id, username], function (error, result){
			if (error){
				callback(error, null);
				done();
			}else{
				callback(null, result.rows[0].retval);
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

exports.savePictureInfos = function (username, name, directory, flash, aperture, exposure_time, focal_distance, iso, callback) {
	username = sanitizer.sanitize(username);
	name = sanitizer.sanitize(name);
	directory = sanitizer.sanitize(directory);
	flash = sanitizer.sanitize(flash);
	aperture = sanitizer.sanitize(aperture);
	exposure_time = sanitizer.sanitize(exposure_time);
	/*focal_distance = focal_distance == null || focal_distance == "" ? 0 : parseInt(focal_distance);
	iso = iso == null || iso == "" ? 0 : parseInt(iso);*/
	focal_distance = sanitizer.sanitize(focal_distance);
	iso = sanitizer.sanitize(iso);

	pg.connect(conString, function(error, client, done){
		if (error){
			return callback(error, null);
		}

		client.query('select func_save_picture_infos($1, $2, $3, $4, $5, $6, $7, $8) as retval', 
			[username, name, directory, flash, aperture, exposure_time, focal_distance, iso], function(error, result){
				done();

				if (error){
					return callback(error, null);
				}

				callback(null, result.rows[0].retval);
			})
	});
};

exports.changeUserName = function (username, forename, surname, callback) {
	username = sanitizer.sanitize(username);
	forename = sanitizer.sanitize(forename);
	surname = sanitizer.sanitize(surname);

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_change_user_name($1, $2, $3) as retval', [username, forename, surname], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};

exports.changeUserMail = function (username, mail, callback) {
	username = sanitizer.sanitize(username);
	mail = sanitizer.sanitize(mail);

	// TODO: Mail überprüfen und erneut Validierungsmail 
	var val = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;	

	if (!mail) {
		return callback(new Error('No mail provided'), null);
	} else if (!val.test(mail)) {
		return callback(new Error('Please provide a valid email address!'), null);
	}

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_change_user_mail($1, $2) as retval', [username, mail], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};

exports.changeUserPassword = function (username, old, new1, new2, callback) {
	username = sanitizer.sanitize(username);
	old = sanitizer.sanitize(old);
	new1 = sanitizer.sanitize(new1);
	new2 = sanitizer.sanitize(new2);

	if (!new1 || !new2) {
		return callback(new Error('No password provided'), null);
	} else if (new1 != new2) {
		return callback(new Error('Password does not match'), null);
	}

	pg.connect(conString, function (error, client, done) {
		if (error) {
			return callback(error, null);
		}

		client.query('select func_change_user_password($1, $2, $3) as retval', [username, old, new1], function (error, result) {
			done();

			if (error) {
				return callback(error, null);
			}

			callback(null, result.rows[0].retval);
		});
	});
};
