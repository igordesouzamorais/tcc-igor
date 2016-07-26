module.exports = function (app) {

	var db = require('../middleware/db')();
	var Schema = require('mongoose').Schema;

	var enderecoSchema = new Schema({
	  cliente: String,
	  endereco: String,
	  numero: String,
	  bairro: String,
	  cep: String,
	  cidade: String,
	  uf: String,
	  observacao: String,
	  localizacao: Array
	});

	return db.model('enderecos', enderecoSchema);
};
