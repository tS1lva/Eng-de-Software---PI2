//CADASTRO DE AERONAVE
var botaoCadastraAeronave = document.querySelector("#btnCadAer");
var formCadAeronave = document.querySelector("#formAeronave");

botaoCadastraAeronave.addEventListener("click", function(event){
    event.preventDefault;
    
    const cadastroAeronave = {
        modelo: formCadAeronave.modelo.value,
        idAeronave: formCadAeronave.idAeronave.value,
        fabricante: formCadAeronave.fabricante.value,
        anofabricado: formCadAeronave.anofabricado.value
    };
});

//CADASTRO DE TRAJETO E AEROPORTO

//CADASTRO DE VOO