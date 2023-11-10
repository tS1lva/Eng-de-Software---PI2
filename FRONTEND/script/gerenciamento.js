function fetchInserir(rota, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(rota, requestOptions).then((response) => response.json());
}

function fetchAlterar(rota, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(rota, requestOptions).then((response) => response.json());
}

function showStatusMessage(message, isError) {
  const statusDiv = document.getElementById("statusMessage");
  statusDiv.innerText = message;
  statusDiv.style.color = isError ? "red" : "green";
}

//GERENCIAMENTO AERONVAE
function inserirAeronave() {
  const fabricante = document.getElementById("fabricante").value;
  const modelo = document.getElementById("modelo").value;
  const anoFab = document.getElementById("ano").value;
  let rota = "http://localhost:3000/inserirAeronave";

  fetchInserir(rota, {
    fabricante: fabricante,
    modelo: modelo,
    anoFabricacao: anoFab,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Aeronave cadastrada com sucesso.", false);
      } else {
        showStatusMessage(
          "Erro ao cadastrar aeronave: " + resultado.message,
          true
        );
        console.log(resultado.message);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao cadastrar. Entre em contato com o suporte.",
        true
      );
      console.log("Falha ao cadastrar.");
    });
}

function alterarAeronave() {
  const modelo = document.getElementById("novoModelo").value;
  const anoFabricacao = document.getElementById("novoAnoFabricacao").value;
  const fabricante = document.getElementById("novoFabricante").value;
  const codigo = document.getElementById("idAeronave").value;
  let rota = "http://localhost:3000/alterarAeronave";

  fetchAlterar(rota, {
    modelo: modelo,
    anoFabricacao: anoFabricacao,
    fabricante: fabricante,
    codigo: codigo,
  })
    .then((data) => {
      console.log("Aeronave alterada com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao alterar aeronave:", error);
    });
}

function excluirAeronave() {
  const codigo = document.getElementById("idAeronave").value;

  fetch(`http://localhost:3000/excluirAeronave`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: codigo }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Aeronave excluída com sucesso: " + data.message);
      } else {
        alert("Erro ao excluir aeronave: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao excluir aeronave: " + error.message);
    });
}

document
  .querySelector("#incluir button")
  .addEventListener("click", inserirAeronave);
document
  .querySelector("#alterar button")
  .addEventListener("click", alterarAeronave);
document
  .querySelector("#excluir button")
  .addEventListener("click", excluirAeronave);

//GERENCIAMENTO AEROPORTO
function inserirAeroporto() {
  const nomeAeroporto = document.getElementById("nomeAeroporto").value;
  const idAeroporto = document.getElementById("idAeroporto").value;
  let rota = "http://localhost:3000/inserirAeroporto";

  fetchInserir(rota, {
    nome: nomeAeroporto,
    idAeroporto: idAeroporto,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Aeroporto cadastrado com sucesso.", false);
      } else {
        showStatusMessage(
          "Erro ao cadastrar aeroporto: " + resultado.message,
          true
        );
        console.log(resultado.message);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao cadastrar. Entre em contato com o suporte.",
        true
      );
      console.log("Falha ao cadastrar.");
    });
}

function alterarAeroporto() {
  const codigo_aeroporto_alterar = document.getElementById(
    "codigo_aeroporto_alterar"
  ).value;
  const novoNomeAeroporto = document.getElementById("novoNomeAeroporto").value;
  const novoCodigoCidade = document.getElementById("novoCodigoCidade").value;
  let rota = "http://localhost:3000/alterarAeroporto";

  fetchAlterar(rota, {
    codigo: codigo_aeroporto_alterar,
    nome: novoNomeAeroporto,
    cidade_id: novoCodigoCidade,
  })
    .then((data) => {
      console.log("Aeroporto alterado com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao alterar aeroporto:", error);
    });
}

function excluirAeroporto() {
  const codigo = document.getElementById("idAeroportoExcluir").value;

  fetch(`http://localhost:3000/excluirAeroporto`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: codigo }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Aeroporto excluído com sucesso: " + data.message);
      } else {
        alert("Erro ao excluir aeroporto: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao excluir aeroporto: " + error.message);
    });
}

//GERENCIAMENTO CIDADE
function inserirCidade() {
  const nomeCidade = document.getElementById("nomeCidade").value;
  let rota = "http://localhost:3000/inserirCidade";

  fetchInserir(rota, {
    nome: nomeCidade,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Cidade cadastrada com sucesso.", false);
      } else {
        showStatusMessage(
          "Erro ao cadastrar cidade: " + resultado.message,
          true
        );
        console.log(resultado.message);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao cadastrar. Entre em contato com o suporte.",
        true
      );
      console.log("Falha ao cadastrar.");
    });
}

function alterarCidade() {
  const novoNomeCidade = document.getElementById("nomeCidade").value;
  const codigo_cidade_alterar = document.getElementById("idCidade").value;
  let rota = "http://localhost:3000/alterarCidade";

  fetchAlterar(rota, {
    codigo: codigo_cidade_alterar,
    nome: novoNomeCidade,
  })
    .then((data) => {
      console.log("Cidade alterada com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao alterar cidade:", error);
    });
}

function excluirCidade() {
  const codigo = document.getElementById("idCidade").value;

  fetch(`http://localhost:3000/excluirCidade`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: codigo }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Cidade excluída com sucesso: " + data.message);
      } else {
        alert("Erro ao excluir cidade: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao excluir cidade: " + error.message);
    });
}

//GERENCIAMENTO TRECHO
function inserirTrecho() {
  const tipo = document.getElementById("tipo").value;
  const cidade_origem = document.getElementById("cidade_origem").value;
  const cidade_destino = document.getElementById("cidade_destino").value;

  let rota = "http://localhost:3000/inserirTrecho";

  fetchInserir(rota, {
    tipo: tipo,
    cidade_origem: cidade_origem,
    cidade_destino: cidade_destino,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Trajeto cadastrado com sucesso.", false);
      } else {
        showStatusMessage(
          "Erro ao cadastrar trajeto: " + resultado.message,
          true
        );
        console.log(resultado.message);
      }
    })
    .catch(() => {
      showStatusMessage("Erro técnico ao cadastrar. Contate o suporte.", true);
      console.log("Falha ao cadastrar.");
    });
}

function alterarTrecho() {
  const codigo_trecho_alterar = document.getElementById(
    "codigo_trecho_alterar"
  ).value;
  const novoTipo = document.getElementById("novoTipo").value;
  const novoCodigoCidadeOrigem = document.getElementById(
    "novoCodigoCidadeOrigem"
  ).value;
  const novoCodigoCidadeDestino = document.getElementById(
    "novoCodigoCidadeDestino"
  ).value;
  let rota = "http://localhost:3000/alterarTrecho";

  fetchAlterar(rota, {
    codigo: codigo_trecho_alterar,
    tipo: novoTipo,
    cidade_origem: novoCodigoCidadeOrigem,
    cidade_destino: novoCodigoCidadeDestino,
  })
    .then((data) => {
      console.log("Trecho alterado com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao alterar Trecho:", error);
    });
}

function excluirTrecho() {
  const codigo = document.getElementById("idTrecho").value;

  fetch(`http://localhost:3000/excluirTrecho`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: codigo }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Trecho excluído com sucesso: " + data.message);
      } else {
        alert("Erro ao excluir Trecho: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao excluir Trecho: " + error.message);
    });
}

//GERENCIAMENTO VOO
function inserirVoo() {
  const horaPartida = document.getElementById("idHoraSaida").value;
  const horaChegada = document.getElementById("idHoraChegada").value;
  const dataPartida = document.getElementById("dataPartida").value;
  const dataChegada = document.getElementById("dataChegada").value;
  const idTrecho = document.getElementById("idTrecho").value;
  const idValor = document.getElementById("valor").value;
  const aeroportoPartida = document.getElementById("idAeroporto").value;
  const aeroportoChegada = document.getElementById("idAeroporto").value;

  let rota = "http://localhost:3000/inserirVoo";

  fetchInserir(rota, {
    hora_origem: horaPartida,
    hora_chegada: horaChegada,
    data_origem: dataPartida,
    data_chegada: dataChegada,
    id_trecho: idTrecho,
    valor: idValor,
    aeroporto_origem: aeroportoPartida,
    aeroporto_chegada: aeroportoChegada,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        mostrarMensagemStatus("Voo cadastrado com sucesso.", false);
      } else {
        mostrarMensagemStatus(
          "Erro ao cadastrar voo: " + resultado.message,
          true
        );
        console.log(resultado.message);
      }
    })
    .catch(() => {
      mostrarMensagemStatus(
        "Erro técnico ao cadastrar. Contate o suporte.",
        true
      );
      console.log("Falha ao cadastrar.");
    });
}

function alterarVoo() {
  const codigo_voo_alterar = document.getElementById("idVoo").value;
  const novaHora_origem = document.getElementById("idHoraSaida").value;
  const novaData_origem = document.getElementById("dataPartida").value;
  const novaHora_chegada = document.getElementById("idHoraChegada").value;
  const novaData_chegada = document.getElementById("dataChegada").value;
  const novoAeroporto_origem = document.getElementById("idAeroporto").value;
  const novoAeroporto_chegada = document.getElementById("idAeroporto").value;
  const novoId_trecho = document.getElementById("idTrecho").value;
  const novoValor = document.getElementById("valor").value;

  let rota = "http://localhost:3000/alterarVoo";

  fetchAlterar(rota, {
    codigo: codigo_voo_alterar,
    hora_origem: novaHora_origem,
    data_origem: novaData_origem,
    hora_chegada: novaHora_chegada,
    data_chegada: novaData_chegada,
    aeroporto_origem: novoAeroporto_origem,
    aeroporto_chegada: novoAeroporto_chegada,
    id_trecho: novoId_trecho,
    valor: novoValor,
  })
    .then((data) => {
      console.log("Voo alterado com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao alterar Voo:", error);
    });
}

function excluirVoo() {
  const codigo = document.getElementById("idVoo").value;

  fetch(`http://localhost:3000/excluirVoo`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: codigo }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Voo excluído com sucesso: " + data.message);
      } else {
        alert("Erro ao excluir Voo: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao excluir Voo: " + error.message);
    });
}

function mostrarMensagemStatus(mensagem, isError) {
  const statusDiv = document.getElementById("statusMessage");
  statusDiv.innerText = mensagem;
  statusDiv.style.color = isError ? "red" : "green";
}
