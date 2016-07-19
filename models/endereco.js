module.exports = function (app) {
	var Schema = require('mongoose').Schema;

	var endereco = Schema({
	  cliente: String,
	  endereco: String,
	  numero: String,
	  bairro: String,
	  cep: String,
	  cidade: String,
	  uf: String,
	  observacao: String,
	  localizacao: {}
	});

	return db.model('enderecos', endereco);
};
