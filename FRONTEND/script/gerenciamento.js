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
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Aeronave incluida com sucesso: " + data.message);
    } else {
      alert("Erro para incluir aeronave: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro para incluir aeronave: " + error.message);
  });
}

function alterarAeronave() {
  const modelo = document.getElementById("novoModelo").value;
  const anoFabricacao = document.getElementById("novoAnoFabricacao").value;
  const fabricante = document.getElementById("novoFabricante").value;
  const codigo = document.getElementById("idAeronaveAlterar").value;
  let rota = "http://localhost:3000/alterarAeronave";

  fetchAlterar(rota, {
    modelo: modelo,
    anoFabricacao: anoFabricacao,
    fabricante: fabricante,
    codigo: codigo,
  })
  .then((data) => {
      if (data.status === "SUCCESS") {
        alert("Aeronave alterada com sucesso: " + data.message);
      } else {
        alert("Erro ao alterar aeronave: " + data.message);
      }
    })
    .catch((error) => {
      alert("Erro ao alterar aeronave: " + error.message);
    });
}

function excluirAeronave() {
  const codigo = document.getElementById("idAeronaveExcluir").value;

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

//GERENCIAMENTO AEROPORTO
function inserirAeroporto() {
  const nomeAeroporto = document.getElementById("nomeAeroporto").value;
  const idCidade = document.getElementById("idCidade").value;
  let rota = "http://localhost:3000/inserirAeroporto";

  fetchInserir(rota, {
    nome: nomeAeroporto,
    cidade_id: idCidade,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Aeroporto inserido com sucesso: " + data.message);
    } else {
      alert("Erro ao inserir aeroporto: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro ao inserir aeroporto: " + error.message);
  });
}

function alterarAeroporto() {
  const codigo_aeroporto_alterar = document.getElementById("codigo_aeroporto_alterar").value;
  const novoNomeAeroporto = document.getElementById("novoNomeAeroporto").value;
  const novoCodigoCidade = document.getElementById("novoCodigoCidade").value;
  let rota = "http://localhost:3000/alterarAeroporto";

  fetchAlterar(rota, {
    codigo: codigo_aeroporto_alterar,
    nome: novoNomeAeroporto,
    cidade_id: novoCodigoCidade,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Aeroporto alterado com sucesso: " + data.message);
    } else {
      alert("Erro ao alterar aeroporto: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro ao alterar aeroporto: " + error.message);
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
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("cidade inserida com sucesso: " + data.message);
    } else {
      alert("Erro ao inserir cidade: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro ao inserir cidade: " + error.message);
  });
}

function alterarCidade() {
  const novoNomeCidade = document.getElementById("novoNomeCidade").value;
  const codigo_cidade_alterar = document.getElementById("novoIdCidade").value;
  let rota = "http://localhost:3000/alterarCidade";

  fetchAlterar(rota, {
    codigo: codigo_cidade_alterar,
    nome: novoNomeCidade,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("cidade alterada com sucesso: " + data.message);
    } else {
      alert("Erro ao alterar cidade: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro ao alterar cidade: " + error.message);
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
  const cidade_origem = document.getElementById("cidade_origem").value;
  const cidade_destino = document.getElementById("cidade_destino").value;

  let rota = "http://localhost:3000/inserirTrecho";

  fetchInserir(rota, {
    cidade_origem: cidade_origem,
    cidade_destino: cidade_destino,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Trecho incluido com sucesso: " + data.message);
    } else {
      alert("Erro para incluir Trecho: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro para incluir Trecho: " + error.message);
  });
}

function alterarTrecho() {
  const codigo_trecho_alterar = document.getElementById("codigo_trecho_alterar").value;
  const novoCodigoCidadeOrigem = document.getElementById("novoCodigoCidadeOrigem").value;
  const novoCodigoCidadeDestino = document.getElementById("novoCodigoCidadeDestino").value;
  let rota = "http://localhost:3000/alterarTrecho";

  fetchAlterar(rota, {
    codigo: codigo_trecho_alterar,
    cidade_origem: novoCodigoCidadeOrigem,
    cidade_destino: novoCodigoCidadeDestino,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Trecho alterado com sucesso: " + data.message);
    } else {
      alert("Erro para alterar Trecho: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro para alterar Trecho: " + error.message);
  });
}

function excluirTrecho() {
  const codigo = document.getElementById("idTrechoExcluir").value;

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
  const aeronave_id = document.getElementById("idAeronave").value;
  const idTrecho = document.getElementById("idTrecho").value;
  const idValor = document.getElementById("valor").value;

  let rota = "http://localhost:3000/inserirVoo";

  fetchInserir(rota, {
    hora_origem: horaPartida,
    hora_chegada: horaChegada,
    data_origem: dataPartida,
    data_chegada: dataChegada,
    trecho_id: idTrecho,
    aeronave_id: aeronave_id,
    valor: idValor,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Voo incluido com sucesso: " + data.message);
    } else {
      alert("Erro para incluir voo: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro para incluir voo: " + error.message);
  });
}

function alterarVoo() {
  const codigo = document.getElementById("novoIdVoo").value;
  const hora_origem = document.getElementById("novaHoraPartida").value;
  const data_origem = document.getElementById("novaDataPartida").value;
  const hora_chegada = document.getElementById("novaHoraChegada").value;
  const data_chegada = document.getElementById("novaDataChegada").value;
  const aeroporto_origem = document.getElementById("novoAeroportoPartida").value;
  const aeroporto_chegada = document.getElementById("novoAeroportoChegada").value;
  const trecho_id = document.getElementById("novoTrechoId").value;
  const aeronave_id = document.getElementById("novoAeronaveId").value;
  const valor = document.getElementById("novoValor").value;

  let rota = "http://localhost:3000/alterarVoo";

  fetchAlterar(rota, {
    codigo: codigo,
    hora_origem: hora_origem,
    data_origem: data_origem,
    hora_chegada: hora_chegada,
    data_chegada: data_chegada,
    aeroporto_origem: aeroporto_origem,
    aeroporto_chegada: aeroporto_chegada,
    trecho_id: trecho_id,
    aeronave_id: aeronave_id,
    valor: valor,
  })
  .then((data) => {
    if (data.status === "SUCCESS") {
      alert("Voo alterado com sucesso: " + data.message);
    } else {
      alert("Erro para alterar voo: " + data.message);
    }
  })
  .catch((error) => {
    alert("Erro para alterar voo: " + error.message);
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
