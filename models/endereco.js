module.exports = function (app) {

	var Mongoose = require('mongoose');

	var enderecoSchema = new Mongoose.Schema({
	  id_endereco: Number,
	  cliente: String,
	  endereco: String,
	  numero: String,
	  bairro: String,
	  cep: String,
	  cidade: String,
	  uf: String,
	  observacao: String,
	  data: Date,
	  lat: String,
	  lng: String
	});

	return db.model('Endereco', enderecoSchema);
};
