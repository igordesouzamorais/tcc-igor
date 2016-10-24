module.exports = function(app) {

var home = app.controllers.home;
var passport = require('passport');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
    	return next();

    res.redirect('/');
}

app.get('/', home.login);
app.get('/mapa',isAuthenticated, home.mapa);
app.get('/home',isAuthenticated, home.index);
app.post('/login', passport.authenticate('login', {
	successRedirect: '/home', 
	failureRedirect: '/',
	failureFlash : true
}));
app.get('/signup', home.signup);
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));
app.get('/logout', home.logout);

};