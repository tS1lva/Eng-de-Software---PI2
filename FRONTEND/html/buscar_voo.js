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

function fetchObter(rota) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body removido, pois GET não deve ter corpo
    };
  
    return fetch(rota, requestOptions).then((response) => response.json());
  }

  function consultarVooCliente() {
    const dataPartida = new Date(document.getElementById("dataIda").value);
  
    // Ajuste para o fuso horário local
    const dataLocal = new Date(dataPartida.getTime() - (dataPartida.getTimezoneOffset() * 60000));
  
    const dataFormatada = dataLocal.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
    let rota = `http://localhost:3000/consultarVooCliente?data_origem=${dataFormatada}`;
  
    fetchObter(rota)
      .then((data) => {
        if (data.status === "SUCCESS") {
          alert("Voos obtidos com sucesso: " + data.message);
        } else {
          alert("Erro ao obter voo: " + data.message);
        }
      })
      .catch((error) => {
        alert("Erro ao obter voo: " + error.message);
      });
  }

  function preencherTabela(vooss) {
    const tblBody = document.getElementById("TblVoosDados");

    voos.forEach((voo) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="leftText">${voo.codigo}</td>
        <td class="leftText">${voo.hora_origem}</td>
        <td class="leftText">${voo.data_origem}</td>
        <td class="leftText">${voo.hora_chegada}</td>
        <td class="leftText">${voo.data_chegada}</td>
        <td class="leftText">${voo.aeroporto_origem}</td>
        <td class="leftText">${voo.aeroporto_chegada}</td>
        <td class="leftText">${voo.trecho_id}</td>
        <td class="leftText">${voo.aeronave_id}</td>
        <td class="rightText">${voo.valor}</td>`;

      tblBody.appendChild(row);
    });
  }

  function exibirVoos() {
    requestListaDeVoos()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabela(customResponse.payload);
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir voos:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", exibirVoos);
  