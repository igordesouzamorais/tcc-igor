module.exports = function(app) {
  var users = app.models.user;
  var HomeController = {
    index: function(req, res) {
      res.render('index', {user:req.user});
    },
    mapa: function(req, res) {
    	res.render('mapa', {user:req.user});
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
    },
    usuarios: function (req, res) {
      users.find(function (err, valores) {
        res.render('usuarios', {usuarios: valores});
      });
    },
    excluir: function (req, res) {
      users.remove({_id:req.params.id}, function (err) {
        console.log(err);
      });

      res.redirect('/');
    },
    alterardados: function (req, res) {
      res.render('alterardados', {user: req.user});
    },
    alterar: function (req, res) {
      res.redirect('/');
    }
  };

  return HomeController;

};