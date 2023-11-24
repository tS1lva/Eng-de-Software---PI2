function fetchInserir(rota, body) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  
    return fetch(rota, requestOptions).then((response) => response.json());
}

function inserirPassagem() {
    const Nome = document.getElementById("Nome").value;
    const Cpf = document.getElementById("Cpf").value;
    let rota = "http://localhost:3000/gravandoDadosClientes";
  
  
    fetchInserir(rota, {
      nome: Nome,
      cpf: Cpf,
    })
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("cliente incluida com sucesso: " + data.message);
      } else {
        alert("Erro para incluir cliente: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro para incluir cliente: " + error.message);
    });
  }

