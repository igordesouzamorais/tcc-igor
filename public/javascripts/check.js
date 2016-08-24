$(document).ready(function(){
	$(document).on('click', 'input[type="checkbox"]', function(){
		var id_endereco = $(this).data('idEndereco');
		var checado = $(this).is(':checked');
		$.ajax({
          type: "PUT",
          url: "/atualiza/" + id_endereco,
          data: {id: id_endereco, check: checado},
          error: function(erro){
            console.log('erro na funcao salvaBanco' + erro);
          }
        });
	});
});