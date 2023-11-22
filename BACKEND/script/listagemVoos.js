function requestListaDeVoos() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/obterVoo', requestOptions)
    .then((response) => response.json());
}

function preencherTabelaVoos(voos) {
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
        preencherTabelaVoos(customResponse.payload);
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((error) => {
      console.error("Erro ao exibir voos:", error);
    });
}

document.addEventListener("DOMContentLoaded", exibirVoos);