module.exports = function(app) {

  	var endereco = app.controllers.endereco;
	app.post('/upload', endereco.upload);
	app.get('/enderecos', endereco.buscar);

};