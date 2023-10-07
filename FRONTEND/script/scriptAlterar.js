// Obtém uma referência para o formulário de aeronaves pelo ID
var formularioAeronave = document.getElementById("alterarAeronave");

formularioAeronave.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtém os valores dos campos do formulário de aeronaves
  var novoModelo = formularioAeronave.elements["novoModelo"].value;
  var novoIdAeronave = formularioAeronave.elements["idAeronave"].value;
  var novoFabricante = formularioAeronave.elements["novoFabricante"].value;
  var novoAnoFabricacao = formularioAeronave.elements["novoFabricante"].value;

  // Verifica se o ano de fabricação é menor que 2005
  if (novoAnoFabricacao < 2005) {
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
var formularioVoos = document.getElementById("alterarVoos");

formularioVoos.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtém os valores dos campos do formulário de voos
  var novaData = formularioVoos.elements["novaData"].value;
  /*var trajeto = formularioVoos.elements["trajeto"].value; Adcionar está opção*/
  var novaHoraPartida = formularioVoos.elements["novaHoraPartida"].value;
  var novaHoraChegada = formularioVoos.elements["novaHoraChegada"].value;
  var novoAeroportoSaida = formularioVoos.elements["novoAeroportoSaida"].value;
  var novoAeroportoChegada = formularioVoos.elements["novoAeroportoChegada"].value;
  var idVoo = formularioVoos.elements["idVoo"].value;
  var novoValorAssento = formularioVoos.elements["novoValorAssento"].value;

  // Validação do ano da data
  var dataObjeto = new Date(novaData);
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
  if (novoValorAssento < 700) {
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
