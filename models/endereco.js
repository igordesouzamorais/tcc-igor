var Mongoose = require('mongoose');

var enderecoSchema = new Mongoose.Schema({
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

var Endereco = Mongoose.model('Endereco', enderecoSchema);

module.exports = Endereco;