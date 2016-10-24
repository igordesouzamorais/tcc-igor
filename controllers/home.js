module.exports = function(app) {
  var HomeController = {
    index: function(req, res) {
      console.log(req.user);
      res.render('index');
    },
    mapa: function(req, res) {
    	res.render('mapa');
    },
    login: function (req, res){
      res.render('login',{message: req.flash('message')});
    },
    logout: function (req, res){
      req.logout();
      res.redirect('/');
    },
    signup: function (req, res) {
      res.render('signup',{message: req.flash('message')});
    }
  };

  return HomeController;

};