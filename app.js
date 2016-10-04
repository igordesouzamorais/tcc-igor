var express = require('express')
  , load = require('express-load')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , logger = require('morgan')
  , session = require('express-session')  
  , app = express()
  , server = require('http').Server(app)
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
;

global.db = require('mongoose');
var conection = db.connection;

conection.on('error', console.error);
conection.once('open', function() {
  console.log('Conectado ao MongoDB corretamente ...')  
});

db.connect('mongodb://127.0.0.1:27017/gra');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mapaeprosfortes',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());


//db conection
/*db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
  
});*/

load('models')
  .then('controllers')
  .then('routes')
  .into(app)
;

//configuracao do passport

var usuario = app.models.user;

passport.use(new LocalStrategy({
  usernameField: 'login',
  passwordField: 'senha'
},
  function(username, password, done) {
    usuario.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      if (!user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  usuario.findById(id, function(err, user) {
    done(err, user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


server.listen(1234, function(){
  console.log("Server tcc-igor executando corretamente ...");
});

module.exports = app;