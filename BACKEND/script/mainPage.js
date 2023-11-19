// Adicione a chamada inicial para ajustar a visibilidade
mostrarDatas();

function mostrarDatas() {
  var opcao1 = document.getElementById("opcao1");
  var dataIda = document.getElementById("dataIda");
  var dataVolta = document.getElementById("dataVolta");
  var labelDataVolta = document.getElementById("labelDataVolta");

  if (opcao1.checked) {
    dataVolta.style.display = "none";
    labelDataVolta.style.display = "none";
    dataIda.style.display = "block";
  } else {
    dataVolta.style.display = "block";
    labelDataVolta.style.display = "block";
    dataIda.style.display = "block";
  }
}