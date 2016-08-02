module.exports = function(app) {
  var enderecoController = {
    upload: function(req, res){
      var valores = JSON.parse(req.body.valor);
      valores.forEach(function(valor, i){
        var endereco = new app.models.endereco;
        endereco.cliente = valor.cliente;
        endereco.endereco = valor.endereco;
        endereco.numero = valor.numero;
        endereco.bairro = valor.bairro;
        endereco.cep = valor.cep;
        endereco.cidade = valor.cidade;
        endereco.uf = valor.uf;
        endereco.observacao = valor.observacao;

        endereco.save();
      });
    }
  };

  return enderecoController;

};