// Obtém uma referência para o formulário de aeronaves pelo ID
var formularioAeronave = document.getElementById("formularioAeronave");

formularioAeronave.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtém os valores dos campos do formulário de aeronaves
  var modelo = formularioAeronave.elements["modelo"].value;
  var idAeronave = formularioAeronave.elements["idAeronave"].value;
  var fabricante = formularioAeronave.elements["fabricante"].value;
  var anoFabricacao = formularioAeronave.elements["anoFabricado"].value;

  // Verifica se o ano de fabricação é menor que 2005
  if (anoFabricacao < 2005) {
    // Se for menor, exibe uma mensagem de erro
    var mensagemErro = document.getElementById("mensagemErro");
    mensagemErro.textContent = "O avião é antigo demais, cadastre outro.";
    return; // Impede o envio do formulário se houver erro
  }

  // Se o ano de fabricação for válido, limpa a mensagem de erro
  var mensagemErro = document.getElementById("mensagemErro");
  mensagemErro.textContent = "";
  // Recarrega a página atual
  location.reload();

});

// Obtém uma referência para o formulário de voos pelo ID
var formularioVoos = document.getElementById("cadastarVoos");

formularioVoos.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtém os valores dos campos do formulário de voos
  var data = formularioVoos.elements["data"].value;
  var trajeto = formularioVoos.elements["trajeto"].value;
  var horaPartida = formularioVoos.elements["horaPartida"].value;
  var horaChegada = formularioVoos.elements["horaChegada"].value;
  var aeroportoSaida = formularioVoos.elements["aeroportoSaida"].value;
  var aeroportoChegada = formularioVoos.elements["aeroportoChegada"].value;
  var idVoo = formularioVoos.elements["idVoo"].value;
  var valorAssento = formularioVoos.elements["valorAssento"].value;

  // Validação do ano da data
  var dataObjeto = new Date(data);
  var anoData = dataObjeto.getFullYear();

  if (anoData >= 2025) {
    // Se o ano da data for igual ou superior a 2024, exibe uma mensagem de erro
    var mensagemErroData = document.getElementById("mensagemErroData");
    mensagemErroData.textContent = "A data deve ser anterior a 2025.";
    return; // Impede o envio do formulário se houver erro
  }

  // Se o ano da data for válido, limpa a mensagem de erro
  var mensagemErroData = document.getElementById("mensagemErroData");
  mensagemErroData.textContent = "";

  // Validação do valor do assento
  if (valorAssento < 700) {
    // Se for menor, exibe uma mensagem de erro
    var mensagemErroValor = document.getElementById("mensagemErroValor");
    mensagemErroValor.textContent = "O voo está barato demais.";
    return; // Impede o envio do formulário se houver erro
  }

  // Se o valor do assento for válido, limpa a mensagem de erro
  var mensagemErroValor = document.getElementById("mensagemErroValor");
  mensagemErroValor.textContent = "";


  // Recarrega a página atual
  location.reload();

});
