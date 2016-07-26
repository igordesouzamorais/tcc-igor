module.exports = function () {
	var mongoose = require('mongoose');
	var env_url = {
		"test": "mongodb://localhost/gra-test",
		"development": "mongodb://localhost/gra"
	};

	var url = env_url[process.env.NODE_ENV || "development"];
	return mongoose.createConnection(url);
}