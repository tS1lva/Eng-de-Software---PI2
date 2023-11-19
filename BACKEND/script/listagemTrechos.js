function requestListaDeTrechos() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterTrecho', requestOptions)
      .then((response) => response.json());
  }
  
  function preencherTabela(trechos) {
    // Acessando o tbody pelo id.
    const tblBody = document.getElementById("TblTrechosDados");

    trechos.forEach((trecho) => {
      const row = document.createElement("tr");

      // Preenchendo as colunas com os campos desejados.
      row.innerHTML = `
        <td class="leftText">${trecho.codigo}</td>
        <td class="leftText">${trecho.cidade_origem}</td>
        <td class="leftText">${trecho.cidade_destino}</td>`;

      tblBody.appendChild(row);
    });
  }

  function exibirTrechos() {
    requestListaDeTrechos()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabela(customResponse.payload);
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir trechos:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", exibirTrechos); // Executa quando a página é carregada.