function requestListaDeAeroportos() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterAeroporto', requestOptions)
      .then((response) => response.json());
  }
  
  function preencherTabela(aeroportos) {
    const tblBody = document.getElementById("TblAeroportosDados");

    aeroportos.forEach((aeroporto) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="leftText">${aeroporto.codigo}</td>
        <td class="leftText">${aeroporto.nome}</td>
        <td class="leftText">${aeroporto.cidade_id}</td>`;

      tblBody.appendChild(row);
    });
  }

  function exibirAeroportos() {
    requestListaDeAeroportos()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabela(customResponse.payload);
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir aeroportos:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", exibirAeroportos);