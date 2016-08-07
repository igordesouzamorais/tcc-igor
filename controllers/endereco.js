module.exports = function(app) {
  var enderecoController = {
    upload: function(req, res){
      var valores = JSON.parse(req.body.valor);
      var e = app.models.endereco;
      valores.forEach(function(valor, i){

        e.findOne({id_endereco:valor.id}, function(erro, resultado){
          //verifica se o endereco ja esta cadastrado no banco de dados, se nao estiver será feito o cadastro
          if(!resultado){
           var endereco = new app.models.endereco;
            endereco.id_endereco = valor.id;
            endereco.cliente = valor.cliente;
            endereco.endereco = valor.endereco;
            endereco.numero = valor.numero;
            endereco.bairro = valor.bairro;
            endereco.cep = valor.cep;
            endereco.cidade = valor.cidade;
            endereco.uf = valor.uf;
            endereco.observacao = valor.observacao;
            endereco.data = valor.data;

            endereco.save(function(sucess, error){
              if (error) console.log(error);
            }); 
          }
        });        
      });
    },
    buscar: function (req, res){
      var e = app.models.endereco;
      var d = new Date();
      var lista = [];

      //busca apenas os atendimentos para o dia atual
      e.find(function(erro, valores){

        valores.forEach(function(valor, i){
          //comparacao para ver se dia, mes ou ano sao iguais
          if ((d.getDate() == valor.data.getDate()) && (d.getMonth() == valor.data.getMonth()) && (d.getFullYear() == valor.data.getFullYear())){
            lista.push(valor);
          }
        });
        
        res.json(lista);
      });
    }
  };

  return enderecoController;

};