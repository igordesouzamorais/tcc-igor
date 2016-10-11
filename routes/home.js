module.exports = function(app) {

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}	

var home = app.controllers.home;
var passport = require('passport');

app.get('/', home.index);
app.get('/mapa', home.mapa);
app.get('/login', home.login);
app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));
app.get('/logout', home.logout);

};