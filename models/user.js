module.exports = function (app) {

	var Mongoose = require('mongoose');
	var bcrypt   = require('bcrypt-nodejs');

	var userSchema = new Mongoose.Schema({
	  username:{type: String, required: true},
	  password: {type: String, required: true}
	});

	userSchema.methods.validPassword = function(password) {
    	return this.password;
	};

	return db.model('User', userSchema);
};
