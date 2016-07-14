$(document).ready(function() {

	$('#caminho').val(getJsonStorage('json'));

	// $(".abrir").sideNav();
	$('.button-collapse').sideNav({
        menuWidth: 220, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
      }
  	);
  	
  	$(".voltar").on("click", function () {
  		$('.fechar').sideNav('hide');
  	});

  	$('#salvar').on("click", function (){
  		setJsonStorage("json", $("#caminho").val());
  		Materialize.toast('<span class="center-align cyan">Caminho Salvo com sucesso!</span>', 3000, 'salvou');
  	});

	/*$("#configs").on("click", function(){
		$("#panelOptions").trigger( "updatelayout" );
		$("#json").val(getJsonStorage("json"));
	});

	
	$("#refresh").on("click", function(){
		window.location.reload();
	});*/

	function setJsonStorage (chave, valor){
		localStorage.setItem(chave,valor);
	}

	function getJsonStorage (chave){
		if (localStorage.getItem(chave)){
			return localStorage.getItem(chave);
		}
	}
});
