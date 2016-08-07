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
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  mapa = new google.maps.Map(document.getElementById("mapa"), mapProp);
  directionsDisplay.setMap(mapa);

  //marcar o centro do mapa
  //sempre será o valor que veio da geolocalização
  setPonto(position.coords.latitude, position.coords.longitude, "Eu estou aqui!");

  carregarPontos();
  buscarCadastrados();
  //getLocation();
  //var way = [{location: new google.maps.LatLng(-22.26016869845083,-53.347003729858386)}, {location: new google.maps.LatLng(-22.25023909514765,-53.353011878051745)}, {location: new google.maps.LatLng(-22.249285816186703,-53.337304862060535)},  {location: new google.maps.LatLng(-22.241341572534918,-53.34786203674315)}, {location: new google.maps.LatLng(-22.253813833459052,-53.36442735961913)}, {location: new google.maps.LatLng(-22.246505382156887,-53.347003729858386)}];
  //geraRota(new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163), listaEnderecos);

  //matrix();
}

//le o arquivo json que foi informado na configuração
function carregarPontos() {
  $.ajax({
    url: getJsonStorage("json"),
    type: 'GET',
    dataType: 'json',
    success: function(json){
        //converteEndereco(json);
        //console.log(json);
        salvaBanco(json);
    },
    error: function(erro){
        console.log('erro na função carrega pontos' + erro);
      }
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
  console.log("chegou na busca dos cadastrados");
  $.ajax({
    url: '/enderecos',
    type: 'GET',
    dataType: 'json',
    success: function(valores){
        console.log("chegou no ajax do buscar cadastrados");
        converteEndereco(valores);
    },
    error: function(erro){
        console.log('erro na função buscar cadastrados' + erro);
      }
  });   
}

//comverte o endereco em latitude e longitude e depois seta esse ponto no mapa
//em vez de setar o ponto no mapa tem que passar para a funcao matriz calcular a distancia primeiro, para depois ser mostrado no mapa os pontos na ordem correta.
function converteEndereco(enderecos) {
  enderecos.forEach(function(endereco, index){
    geocoder.geocode( { 'address': endereco.endereco + ', ' + endereco.numero + ', ' + endereco.cidade + ', ' + endereco.uf}, function(resultado, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
              map: mapa,
              position: resultado[0].geometry.location
        });
        
        endereco.localizacao = resultado[0].geometry.location;

        console.log(endereco);

      }
      else {
        console.log('Erro ao converter endereço: ' + status);
      }
    });
  });
}

function setPonto (latitude , longitude, titulo){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude , longitude),
    title: titulo,
    map: mapa
  });
}

function setPontoEndereco (endereco, titulo){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(endereco),
    title: titulo,
    map: mapa
  });
}

function geraRota (origem, destino, waypts) {
  var request = {
    origin: origem,
    destination: destino,
    waypoints: waypts,
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

function matrix (origin, destinos) {
    
  var origin = [new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163), new google.maps.LatLng(-22.248014767478885,-53.34794786743163)];
  var destinos = [new google.maps.LatLng(-22.26016869845083,-53.347003729858386), new google.maps.LatLng(-22.25023909514765,-53.353011878051745), new google.maps.LatLng(-22.249285816186703,-53.337304862060535), new google.maps.LatLng(-22.241341572534918,-53.34786203674315), new google.maps.LatLng(-22.253813833459052,-53.36442735961913), new google.maps.LatLng(-22.246505382156887,-53.347003729858386)];

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