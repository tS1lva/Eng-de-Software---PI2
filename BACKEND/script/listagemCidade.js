function requestListaDeCidades() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterCidades', requestOptions)
      .then((response) => response.json());
  }
  
  function preencherTabela(cidades) {
    const tblBody = document.getElementById("TblCidadeDados");

    cidades.forEach((cidade) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="leftText">${cidade.codigo}</td>
        <td class="leftText">${cidade.nome}</td>`;

      tblBody.appendChild(row);
    });
  }

  function exibirCidades() {
    requestListaDeCidades()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabela(customResponse.payload);
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir cidades:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", exibirCidades);