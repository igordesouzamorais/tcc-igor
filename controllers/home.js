module.exports = function(app) {
  var HomeController = {
    index: function(req, res) {
      res.render('index');
    },
    mapa: function(req, res) {
    	var endereco = app.models.endereco;
    	res.render('mapa', {'endereco':endereco});
    },
    upload: function(req, res){
      
      console.log('entrou no controller upload');
      var valores = JSON.parse(req.body.valor);
      //console.log(typeof valores);
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

      //console.log(endereco);
    }
  };

  return HomeController;

};