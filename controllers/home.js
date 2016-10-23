module.exports = function(app) {
  var HomeController = {
    index: function(req, res) {
      res.render('index');
    },
    mapa: function(req, res) {
    	res.render('mapa');
    },
    login: function (req, res, next){
      res.render('login');
    },
    logout: function (req, res){
      req.logout();
      res.redirect('/');
    },
    signup: function (req, res) {
      res.render('signup');
    }
  };

  return HomeController;

};