function requestListaDeAeronaves() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterAeronaves', requestOptions)
      .then((response) => response.json());
  }
  
  function preencherTabela(aeronaves) {
    // Acessando o tbody pelo id.
    const tblBody = document.getElementById("TblAviaoDados");

    aeronaves.forEach((aeronave) => {
      const row = document.createElement("tr");

      // Preenchendo as colunas com os campos desejados.
      row.innerHTML = `
        <td class="leftText">${aeronave.codigo}</td>
        <td class="leftText">${aeronave.modelo}</td>
        <td class="leftText">${aeronave.fabricante}</td>
        <td class="rightText">${aeronave.anoFabricacao}</td>`;

      tblBody.appendChild(row);
    });
  }

  function exibirAeronaves() {
    requestListaDeAeronaves()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabela(customResponse.payload);
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir aeronaves:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", exibirAeronaves); // Executa quando a página é carregada.