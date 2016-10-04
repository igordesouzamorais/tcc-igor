module.exports = function(app) {

  var home = app.controllers.home;
  var passport = require('passport');
  var authenticate = require('../middleware/autenticate');

  app.get('/', home.index);
  app.get('/mapa', home.mapa);
  app.get('/login', home.login);
  app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'}));
  
};