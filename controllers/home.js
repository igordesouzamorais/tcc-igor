module.exports = function(app) {
  var HomeController = {
    index: function(req, res) {
      res.render('index');
    },
    mapa: function(req, res) {
    	res.render('mapa');
    }
  };

  return HomeController;

};