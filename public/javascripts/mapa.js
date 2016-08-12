//variaveis globais

var mapa;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var centro;
var geocoder;
var listaEnderecos = [];


function initialize(position){

  directionsDisplay = new google.maps.DirectionsRenderer();
  geocoder = new google.maps.Geocoder();

  centro = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var mapProp = {
    center: centro,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  mapa = new google.maps.Map(document.getElementById("mapa"), mapProp);
  directionsDisplay.setMap(mapa);

  carregarPontos();
}

//le o arquivo json que foi informado na configuração
function carregarPontos() {
  $.ajax({
    url: getJsonStorage("json"),
    type: 'GET',
    dataType: 'json',
    success: function(json){
        salvaBanco(json);
    },
    error: function(erro){
        console.log(erro);
      }
  }).done(function(){
    buscarCadastrados(); //após salvar todos os enderecos chama a funcao buscar cadastrados
  }); 
}

function salvaBanco (valores){
  var novo = JSON.stringify(valores);
  $.ajax({
    type: "POST",
    url: "/upload",
    data: {valor: novo},
    success: function () {
       console.log('deu certo');
    },
    error: function(erro){
      console.log('erro na funcao salvaBanco' + erro);
    }
  });
}

function buscarCadastrados(){
  $.ajax({
    url: '/enderecos',
    type: 'GET',
    dataType: 'json',
    success: function(valores){
        //console.log("chegou no ajax do buscar cadastrados");
        converteEndereco(valores);
    },
    error: function(erro){
        console.log('erro na função buscar cadastrados' + erro);
      }
  }).done(function (valores) {
    console.log("proximo passo a ser feito apos atualizar a latitude e longitude no banco de dados");
    geraRota(valores);
  });   
}

//comverte o endereco em latitude e longitude e depois seta esse ponto no mapa
//em vez de setar o ponto no mapa tem que passar para a funcao matriz calcular a distancia primeiro, para depois ser mostrado no mapa os pontos na ordem correta.
function converteEndereco(enderecos) {
  enderecos.forEach(function(endereco, index){
    geocoder.geocode( { 'address': endereco.endereco + ', ' + endereco.numero + ', ' + endereco.cidade + ', ' + endereco.uf}, function(resultado, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //setPonto(resultado[0].geometry.location.lat(), resultado[0].geometry.location.lng(), endereco.observacao);

        endereco.lat = resultado[0].geometry.location.lat();
        endereco.lng = resultado[0].geometry.location.lng();
        
        //envia a latitude e longitude convertida para ser salva no banco de dados
        $.ajax({
          type: "PUT",
          url: "/atualizar/" + endereco._id,
          data: endereco,
          success: function () {
             console.log("sucesso na função de converte enderecos");
          },
          error: function(erro){
            console.log('erro na funcao converte endereco' + erro);
          }
        });
      }
      else {
        console.log('Erro ao converter endereço: ' + status);
      }
    });
  });
}

function setPonto (latitude , longitude){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude , longitude),
    map: mapa
  });
}

function geraRota (valores) {
  console.log("exibindo as rotas no mapa");

  var waypts = [];

  valores.forEach(function (valor, index) {
    var temp = {};
    temp.location = new google.maps.LatLng(valor.lat, valor.lng);
    //temp.stopover = true;
    waypts.push(temp);
  });

  var request = {
    origin: centro,
    destination: new google.maps.LatLng(-22.24768725649605, -53.35948604999999),
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function getLocation() {
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(initialize);
  }
  else {
    alert("Geolocation is not supported by this browser.");
  }
}

function matrix (enderecos) {
    
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: origin,
      destinations: destinos,
      travelMode: google.maps.TravelMode.DRIVING
      //transitOptions: TransitOptions,
      //drivingOptions: DrivingOptions,
      //unitSystem: UnitSystem,
      //avoidHighways: false,
      //avoidTolls: false,
    }, callback);

  function callback(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var origens = response.originAddresses;
      var destinos = response.destinationAddresses;

      for (var i = 0; i < origens.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origens[i];
          var to = destinos[j];
          console.log(element + " - " + distance + " - "+ duration + " - "+ from + " - " + to + "\n\n");
        }
      }
    }
  }
}

//funcoes de gravar e ler o caminho do arquivo json

function setJsonStorage (chave, valor){
  localStorage.setItem(chave,valor);
}

function getJsonStorage (chave){
  if (localStorage.getItem(chave)){
    return localStorage.getItem(chave);
  }
}


//iniciaza o mapa
google.maps.event.addDomListener(window, 'load', getLocation);