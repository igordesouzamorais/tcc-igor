var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/mapa', function (req, res, next) {
	res.render('mapa');
});

module.exports = router;
