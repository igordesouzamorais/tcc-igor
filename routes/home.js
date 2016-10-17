module.exports = function(app) {

var home = app.controllers.home;
var passport = require('passport');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
    	return next();
	}else{
    	res.redirect('/');
	}
}

app.get('/', home.login);
app.get('/mapa', home.mapa);
app.get('/home', home.index);
app.post('/login', passport.authenticate('login', {
	successRedirect: '/home', 
	failureRedirect: '/'
}));
app.get('/signup', home.signup);
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup'
  }));
app.get('/logout', home.logout);

};