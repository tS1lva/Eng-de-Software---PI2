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
      console.log(resposta.message);
    } else {
      console.log("Erro ao inserir assento: " + resposta.message);
    }
  } catch (erro) {
    console.log("Erro na requisição: " + erro.message);
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
        console.log(data.message);
        exibirOpcoesPagamento(); // Adicionado para mostrar as opções de pagamento
      } else {
        console.log(data.message);
      }
    })
    .catch((error) => {
      alert("Erro para incluir cliente: " + error.message);
    });
  }


// Função para fazer a solicitação de dados de compra ao backend
function requestDadosCompra() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/DadosCompra', requestOptions)
    .then((response) => response.json());
}


// Função para preencher a tabela com os dados de compra
function preencherTabelaCompra(dadosCompra) {
  // Acessando o tbody pelo id.
  const tblBody = document.getElementById("tabelaDados");

  dadosCompra.forEach((passagem) => {
    const row = document.createElement("tr");

    // Preenchendo as colunas com os campos desejados.
    row.innerHTML = `
      <td>${passagem.voo_id}</td>
      <td>${passagem.Coluna}</td>
      <td>${passagem.Linha}</td>
      <td>${passagem.data_ida}</td>
      <td>${passagem.hora_ida}</td>
      <td>${passagem.data_volta}</td>
      <td>${passagem.hora_volta}</td>
      <td>${passagem.aeroporto_ida}</td>
      <td>${passagem.aeroporto_saida}</td>
      <td>${passagem.valor}</td>`;

    tblBody.appendChild(row);
  });

  // Calcular e exibir o valor total após preencher a tabela
  const valorTotal = calcularValorTotal(dadosCompra);
}

function exibirDadosCompra() {
  requestDadosCompra()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        preencherTabelaCompra(customResponse.payload);
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((error) => {
      console.error("Erro ao exibir dados de compra:", error);
    });
}

function calcularValorTotal(dadosCompra) {
  let valorTotal = 0;

  // Itera sobre os itens da compra e acumula os valores
  for (let i = 0; i < dadosCompra.length; i++) {
    valorTotal += dadosCompra[i].valor;
  }

  // Atualiza o elemento HTML com o valor total
  const valorTotalElement = document.getElementById("valorTotal");
  valorTotalElement.innerHTML = "Valor Total da Compra: R$" + valorTotal.toFixed(2);

  return valorTotal;
}

requestDadosCompra()
  .then((customResponse) => {
    if (customResponse.status === "SUCCESS") {
      const dadosCompra = customResponse.payload;
      const valorTotal = calcularValorTotal(dadosCompra);
      console.log("Valor Total da Compra: R$" + valorTotal.toFixed(2));
    } else {
      console.log(customResponse.message);
    }
  })
  .catch((error) => {
    console.error("Erro ao calcular valor total da compra:", error);
  });

document.addEventListener("DOMContentLoaded", exibirDadosCompra);



// Adicione estas funções no seu arquivo pagamento.js

function exibirFormularioPagamento() {
  const metodoPagamento = document.getElementById("metodoPagamento").value;
  const codigoPixDiv = document.getElementById("codigoPixDiv");
  const dadosCartaoDiv = document.getElementById("dadosCartaoDiv");
  exibirCodigoPixFicticio();
  if (metodoPagamento === "pix") {
    codigoPixDiv.style.display = "block";
    dadosCartaoDiv.style.display = "none";
    // Chame a função para exibir o código Pix fictício
    exibirCodigoPixFicticio();
  } else if (metodoPagamento === "cartao") {
    codigoPixDiv.style.display = "none";
    dadosCartaoDiv.style.display = "block";
  }
}



function exibirCodigoPixFicticio() {
  // Lógica para gerar e exibir o código Pix fictício
  const codigoPixInput = document.getElementById("codigoPix");
  codigoPixInput.value = "123456789"; // Substitua por sua lógica real
}

function confirmarPagamentoPix() {
  gravarAssentos();
  inserirPassagem();
  exibirMensagemCompra();
}

function confirmarPagamentoCartao() {
  // Lógica para confirmar o pagamento via Cartão de Crédito
  const numeroCartao = document.getElementById("numeroCartao").value;
  const titularCartao = document.getElementById("titularCartao").value;
  const cvvCartao = document.getElementById("cvvCartao").value;
  const dataValidadeCartao = document.getElementById("dataValidadeCartao").value;
  gravarAssentos();
  inserirPassagem();

  // Valide os dados do cartão e prossiga conforme necessário
  // ...

  exibirMensagemCompra();
}

function exibirMensagemCompra() {
  const mensagemCompraDiv = document.getElementById("mensagemCompra");
  mensagemCompraDiv.style.display = "block";
}

function exibirOpcoesPagamento() {
  const dadosDiv = document.getElementById("dados");
  const opcoesPagamentoDiv = document.getElementById("opcoesPagamento");

  // Oculta os campos de dados e exibe as opções de pagamento
  dadosDiv.style.display = "none";
  opcoesPagamentoDiv.style.display = "block";
}


function confirmarDadosCliente() {
  exibirOpcoesPagamento();
}





