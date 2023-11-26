function fetchInserir(rota, body) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  
    return fetch(rota, requestOptions).then((response) => response.json());
}

async function gravarAssentos() {
  try {
    const resposta = await requestInserindoAssento();
    if (resposta.status === "SUCCESS") {
      alert(resposta.message);
    } else {
      alert("Erro ao inserir assento: " + resposta.message);
    }
  } catch (erro) {
    alert("Erro na requisição: " + erro.message);
  }
}

async function requestInserindoAssento() {
  try {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch('http://localhost:3000/InserirAssento', requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Erro na requisição: " + error.message);
  }
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


function criarDIVCARTÂO() {
  
}
function confirmarDados() {
  
}

