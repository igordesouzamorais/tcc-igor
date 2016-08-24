//variaveis globais

var mapa;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var centro;
var geocoder;
var markerArray = []; //array com todos os marcadores do mapa
var stepDisplay = new google.maps.InfoWindow({ //caixa de informações dos marcadores
  maxWidth: 250 //setando o tamanho maximo do infowindow
});
var icone = 'images/icon-map24.png'; //icone padrao dos marcadores

function initialize(position){

  directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true // esconde os marcadores padrão do directions service
  });
  geocoder = new google.maps.Geocoder();

  centro = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //recebendo o centro de acordo com a sua posição atual
  var mapProp = {
    center: centro,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  mapa = new google.maps.Map(document.getElementById("mapa"), mapProp);
  directionsDisplay.setMap(mapa);

  carregarPontos();
}

function getLocation() {
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(initialize);
  }
  else {
    alert("Geolocation is not supported by this browser.");
  }
}

//le o arquivo json que foi informado na configuração
function carregarPontos() {
  $.ajax({
    url: getJsonStorage("json"),
    type: 'GET',
    dataType: 'json',
    error: function(erro){
        console.log(erro);
      }
  }).done(function(json){
    converteEndereco(json);
    buscarCadastrados(); //após salvar todos os enderecos chama a funcao buscar cadastrados
  }); 
}

function buscarCadastrados(){
  $.ajax({
    url: '/enderecos',
    type: 'GET',
    dataType: 'json',
    error: function(erro){
        console.log('erro na função buscar cadastrados' + erro);
      }
    }).done(function(valores) {
      geraRota(valores);
  });
}

//comverte o endereco em latitude e longitude e depois seta esse ponto no mapa
//em vez de setar o ponto no mapa tem que passar para a funcao matriz calcular a distancia primeiro, para depois ser mostrado no mapa os pontos na ordem correta.
function converteEndereco(enderecos) {
  enderecos.forEach(function(endereco, index){
    geocoder.geocode( { 'address': endereco.endereco + ', ' + endereco.numero + ', ' + endereco.cidade + ', ' + endereco.uf}, function(resultado, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        endereco.lat = resultado[0].geometry.location.lat();
        endereco.lng = resultado[0].geometry.location.lng();
        
        $.ajax({
          type: "POST",
          url: "/upload",
          data: endereco,
          error: function(erro){
            console.log('erro na funcao salvaBanco' + erro);
          }
        });
      }
      else {
        console.log('Erro ao converter endereço: ' + status);
      }
    });
  });
}

function geraRota (valores) {
  clearMarkers();
  var waypts = [];
  valores.forEach(function (valor, index) {
    var temp = {};
    temp.location = valor.endereco + ', ' + valor.numero + ', ' + valor.cidade + ', ' + valor.uf;
    temp.stopover = true;
    waypts.push(temp);
  });

  var request = {
    origin: centro,
    destination: centro,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);

      //gerar os marcadores personalizados com as informações necessárias para a aplicação
      setarMarcadores(valores);
    }
  });
}


function setarMarcadores(valores){
  valores.forEach(function(valor, index){
    var pos = {lat: parseFloat(valor.lat), lng: parseFloat(valor.lng)};
    var marker = new google.maps.Marker({
      position: pos,
      map: mapa,
      icon: icone
    });

    var html = "<h1 class='titulo-marcador'>" + valor.cliente + '</h1>' + 
    "<div id='conteudo-marcador'>" + 
    '<h2>Endereço: </h2><div>' + valor.endereco + ', ' + valor.numero + ', ' + valor.cidade + ', ' + valor.uf + '</div>' + 
    '<h2>Serviço a ser Feito: </h2><div>' + valor.observacao + '</div>' +
    '<input type="checkbox" data-id-endereco="'+ valor.id_endereco + '" id="visita"' + ' /><label for="visita">Endereço Visitado ?</label>' +
    '</div>'
    setTextMarker(marker, html);
    markerArray[i] = marker;
  });
}

function setTextMarker(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    stepDisplay.setContent(text);
    stepDisplay.open(mapa, marker);
  });
}

function clearMarkers (){
  for (i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
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

