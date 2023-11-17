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

function requestListaDeAeroportos() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterAeroporto', requestOptions)
        .then((response) => response.json());
}

function preencherSelectAeroportos(aeroportos) {
    const selectAeroportoOrigem = document.getElementById("aeroportoOrigem");
    const selectAeroportoDestino = document.getElementById("aeroportoDestino");

    // Preenchendo lista Origem
    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.codigo;
        option.text = aeroporto.nome;

        selectAeroportoOrigem.appendChild(option);
    });

    // Preenchendo lista Destino
    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.codigo;
        option.text = aeroporto.nome;

        selectAeroportoDestino.appendChild(option);
    });

    // Adicionando ouvinte de evento para o elemento aeroportoOrigem
    selectAeroportoOrigem.addEventListener("change", function () {
        const opcaoOrigem = selectAeroportoOrigem.value;
        console.log("Origem:", opcaoOrigem);
    });

    // Adicionando ouvinte de evento para o elemento aeroportoDestino
    selectAeroportoDestino.addEventListener("change", function () {
        const opcaoDestino = selectAeroportoDestino.value;
        console.log("Destino:", opcaoDestino);
    });
}

function exibirAeroportos() {
    requestListaDeAeroportos()
        .then((customResponse) => {
            if (customResponse.status === "SUCCESS") {
                preencherSelectAeroportos(customResponse.payload);
            } else {
                console.log(customResponse.message);
            }
        })
        .catch((error) => {
            console.error("Erro ao exibir aeroportos:", error);
        });
}

document.addEventListener("DOMContentLoaded", exibirAeroportos);



function consultarVooCliente() {
    const dataPartida = document.getElementById("dataIda").value;
    const dataChegada = document.getElementById("dataChegada").value;
    const aeronave_id = document.getElementById("idAeronave").value;
    const idTrecho = document.getElementById("idTrecho").value;
    const idValor = document.getElementById("valor").value;
  
    let rota = "http://localhost:3000/inserirVoo";
  
    fetchInserir(rota, {
      hora_origem: horaPartida,
      hora_chegada: horaChegada,
      data_origem: dataPartida,
      data_chegada: dataChegada,
      trecho_id: idTrecho,
      aeronave_id: aeronave_id,
      valor: idValor,
    })
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Voo incluido com sucesso: " + data.message);
      } else {
        alert("Erro para incluir voo: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro para incluir voo: " + error.message);
    });
  }