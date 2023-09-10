var bottonCadAer = document.querySelector("#btnCadAer");

bottonCadAer.addEventListener("click", function(event){
    event.preventDefault;
    
    var formCadAeronave = document.querySelector("#formAeronave");
    window.alert(formCadAeronave.modelo.value);
})
