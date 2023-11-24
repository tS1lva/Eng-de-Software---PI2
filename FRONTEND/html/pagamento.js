function fetchInserir(rota, body) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  
    return fetch(rota, requestOptions).then((response) => response.json());
}

function inserirAssentoIda(Filtro) {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    let rota = "http://localhost:3000/gravandoAssentoIda";
  
  
    fetchInserir(rota, {
      voo_id: Voo_id,
      linha: Linha,
      coluna: Coluna,
    })
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Assento incluida com sucesso: " + data.message);
      } else {
        alert("Erro para incluir Assento: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro para incluir Assento: " + error.message);
    });
  }

