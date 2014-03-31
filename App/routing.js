var DB = require('./modules/DB');

module.exports = function(app) {
	app.post('/', function(req,res) {
		DB.Login(req.body.username, req.body.password, function(err, result) {
			if(err) {
				console.log(err);
			} else {
				if(result.rows[0].retval) {
					console.log('erfolg');
					res.redirect('/account');
				} else {
					console.log('misserfolg');
				}
			}
		});
	});
};
