module.exports = function(app) {

  var home = app.controllers.home;

  app.get('/', home.index);
  app.get('/mapa', home.mapa);
  app.post('/upload', home.upload);
  
};