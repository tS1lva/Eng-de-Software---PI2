function requestListaDeAeroportos() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterAeroporto', requestOptions)
        .then((response) => response.json());
}

var aeroportoOrigem = 1;
var aeroportoDestino = 1;

function preencherSelectAeroportos(aeroportos) {
    const selectAeroportoOrigem = document.getElementById("aeroportoOrigem");
    const selectAeroportoDestino = document.getElementById("aeroportoDestino");
    const selectAeroportoOrigemVolta = document.getElementById("aeroportoOrigemVolta");
    const selectAeroportoDestinoVolta = document.getElementById("aeroportoDestinoVolta");

    // Preenchendo lista Origem IDA
    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.codigo;
        option.text = aeroporto.nome;

        selectAeroportoOrigem.appendChild(option);
    });

    // Preenchendo lista Destino IDA
    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.codigo;
        option.text = aeroporto.nome;

        selectAeroportoDestino.appendChild(option);
    });

      // Preenchendo lista Origem VOLTA
      aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.codigo;          option.text = aeroporto.nome;
  
        selectAeroportoOrigemVolta.appendChild(option);
    });

    // Preenchendo lista Destino VOLTA
    aeroportos.forEach((aeroporto) => {
      const option = document.createElement("option");
      option.value = aeroporto.codigo;
      option.text = aeroporto.nome;

      selectAeroportoDestinoVolta.appendChild(option);
  });

    // Adicionando ouvinte de evento para o elemento aeroportoOrigem
    selectAeroportoOrigem.addEventListener("change", function () {
        const opcaoOrigem = selectAeroportoOrigem.value;
        console.log("Origem:", opcaoOrigem);
        aeroportoOrigem = Number(opcaoOrigem);
        selectAeroportoDestinoVolta.value = selectAeroportoOrigem.value;
    });

    // Adicionando ouvinte de evento para o elemento aeroportoDestino
    selectAeroportoDestino.addEventListener("change", function () {
        const opcaoDestino = selectAeroportoDestino.value;
        console.log("Destino:", opcaoDestino);
        aeroportoDestino = Number(opcaoDestino);
        selectAeroportoOrigemVolta.value = selectAeroportoDestino.value;
    });
}

function exibirAeroportos() {
    requestListaDeAeroportos()
        .then((customResponse) => {
            if (customResponse.status === "SUCCESS") {
                preencherSelectAeroportos(customResponse.payload);
            } else {
                console.log(customResponse.message);
            }
        })
        .catch((error) => {
            console.error("Erro ao exibir aeroportos:", error);
        });
}

document.addEventListener("DOMContentLoaded", exibirAeroportos);

function fetchObter(rota) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
  
    return fetch(rota, requestOptions).then((response) => response.json());
  }

  function consultarVooCliente() {
    return new Promise((resolve, reject) => {
      const dataPartida = new Date(document.getElementById("dataIda").value);
      const dataLocal = new Date(dataPartida.getTime() - (dataPartida.getTimezoneOffset() * 60000));
      const dataFormatada = dataLocal.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      
      let rota = `http://localhost:3000/consultarVooCliente?data_origem=${dataFormatada}&aeroporto_origem=${aeroportoOrigem}&aeroporto_destino=${aeroportoDestino}`;

  
      fetchObter(rota)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

function selecaoVooVolta(){
  const opcaoVoltaSelecionado = 1;

  return opcaoVoltaSelecionado;
}  
function exibirVoos() {
  const elementosAntigos = document.querySelectorAll('.linha');
  elementosAntigos.forEach(elemento => elemento.remove());
  const tblBody = document.getElementById("TblVoosDados");
  tblBody.innerHTML = ""; 

  consultarVooCliente()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        preencherTabela(customResponse.payload);

        const tabelaDivIda = document.getElementById("DivTabelaIda");
        tabelaDivIda.style.display = "block";
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((error) => {
      console.error("Erro ao exibir voos:", error);
    });
}

function preencherTabela(voos) {
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
          <td class="rightText">${voo.valor}</td> 
          <td>
            <button class="btn btn-primary" onclick="criarBotoes(${voo.codigo})">Escolher Assento</button>
          </td>`;

      tblBody.appendChild(row);
  });
}

// Função para converter letras de coluna em números
function converterLetraParaNumero(letra) {
const mapeamento = {
  'A': 1,
  'B': 2,
  'C': 3,
  'D': 4,
  // Adicione mais mapeamentos conforme necessário
};

const letraMaiuscula = letra.toUpperCase();
return mapeamento[letraMaiuscula] || null;
}

// Função para obter a lista de assentos do servidor
function fetchListaDeAssentos(filtro) {
const requestOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

const url = `http://localhost:3000/exibirAssento?filtro=${filtro}`;

return fetch(url, requestOptions)
  .then((response) => response.json())
  .then((data) => {
    if (data.status === 'SUCCESS') {
      console.log('Dados de assentos:', data.payload);
      return data.payload.map((assentoData) => {
        return {
          coluna: assentoData.coluna,
          linha: assentoData.linha,
        };
      });
    } else {
      throw new Error('Erro ao obter dados de assentos');
    }
  });
}

var assento_clicado = {
  voo_id: Number,
  linha: Number,
  coluna: Number
};

function fetchInserir(rota, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(rota, requestOptions).then((response) => response.json());
}

function criarBotaoSalvarAssentoIda(Filtro) {
  // Criar botão "Salvar Assento"
  var botaoSalvarAssentoIDA = document.createElement("button");
  botaoSalvarAssentoIDA.innerHTML = "Salvar AssentoIDA";
  botaoSalvarAssentoIDA.addEventListener("click", function() {
    inserirAssentoIda(Filtro);
  });

  return botaoSalvarAssentoIDA;
}

function criarBotaoSalvarAssentoVolta(Filtro) {
  // Criar botão "Salvar Assento"
  var botaoSalvarAssentoVOLTA = document.createElement("button");
  botaoSalvarAssentoVOLTA.innerHTML = "Salvar Assento";
  botaoSalvarAssentoVOLTA.addEventListener("click", function() {
    inserirAssentoVolta(Filtro);
  });

  return botaoSalvarAssentoVOLTA;
}

function criarDivComBotaoSalvar(Filtro) {
  // Criar div dinamicamente
  var minhaDiv = document.createElement("div");
  minhaDiv.id = "minhaDiv"; // Definir o ID da div

  // Criar botão "Salvar Assento"
  var botaoSalvarAssentoIDA = criarBotaoSalvarAssentoIda(Filtro);
  var botaoSalvarAssentoVOLTA = criarBotaoSalvarAssentoVolta(Filtro);
  // Adicionar botão ao conteúdo da div
  minhaDiv.appendChild(botaoSalvarAssentoIDA);
  minhaDiv.appendChild(botaoSalvarAssentoVOLTA);

  // Adicionar a div ao corpo do documento
  document.body.appendChild(minhaDiv);
}

function limparDiv() {
  var minhaDiv = document.getElementById("minhaDiv");
  if (minhaDiv) {
    minhaDiv.innerHTML = ""; // Limpa o conteúdo da div
    minhaDiv.remove(); // Remove a div do DOM
  }
}


function criarBotoes(Filtro) {
  limparDiv();
  // Cria um novo elemento div para conter os botões de assento
  const assentosDiv = document.createElement('div');

  // Remove os botões de assento existentes, se houver
  const elementosAntigos = document.querySelectorAll('.linha');
  elementosAntigos.forEach(elemento => elemento.remove());

  const colunas = 5;
  const linhas = 4;
  const filtro = Filtro;

  fetchListaDeAssentos(filtro)
    .then((assentos) => {
      for (let i = 0; i < linhas; i++) {
        const linhaDiv = document.createElement('div');
        linhaDiv.classList.add('linha');

        for (let j = 0; j < colunas; j++) {
          const numeroBotao = i * colunas + j + 1;
          const botao = document.createElement('button');
          botao.innerText = numeroBotao;
          botao.setAttribute('data-coluna', j + 1);
          botao.setAttribute('data-linha', i + 1);

          const assentoReservado = assentos.find(assento => assento.coluna === j + 1 && assento.linha === i + 1);

          if (assentoReservado) {
            botao.classList.add('assento-reservado');
          } else {
            botao.classList.add('assento-disponivel');
          }

          botao.addEventListener('click', function(event) {
            const coluna = event.target.getAttribute('data-coluna');
            const linha = event.target.getAttribute('data-linha');
            assento_clicado.linha = linha;
            assento_clicado.coluna = coluna;
            assento_clicado.voo_id = Filtro;
            const assentoClicado = assentos.find(assento => assento.coluna == coluna && assento.linha == linha);
            const numeroBotao = event.target.innerText;

            if (assentoClicado) {
                alert('Assento Reservado!');
                console.log(`Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`);
            } else {
                console.log(`Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`);
                assento_clicado.coluna = coluna;
                assento_clicado.linha = linha;
                if (event.target.classList.contains('assento-selecionado')) {
                    event.target.classList.remove('assento-selecionado');
                    event.target.classList.add('assento-disponivel');
                    limparDiv();
                } else if (event.target.classList.contains('assento-disponivel')) {
                    const assentosSelecionados = document.querySelectorAll('.assento-selecionado');
                    
                    if (assentosSelecionados.length >= 1) {
                        alert('Deve ser comprado um assento por vez');
                        return;
                    }
                    event.target.classList.remove('assento-disponivel');
                    event.target.classList.add('assento-selecionado');
                    criarDivComBotaoSalvar(Filtro);
                }
            }
        });

          linhaDiv.appendChild(botao);
        }

        // Adiciona a linhaDiv ao elemento assentosDiv
        assentosDiv.appendChild(linhaDiv);
      }

      // Adiciona o elemento assentosDiv ao corpo do documento
      document.body.appendChild(assentosDiv);
    })
    .catch((error) => {
      console.error('Erro ao obter lista de assentos:', error.message);
    });
}

function inserirAssentoIda(Filtro) {
  const Voo_id = assento_clicado.voo_id;
  const Linha = assento_clicado.linha
  const Coluna = assento_clicado.coluna
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

function inserirAssentoVolta(Filtro) {
  const Voo_id = assento_clicado.voo_id;
  const Linha = assento_clicado.linha
  const Coluna = assento_clicado.coluna
  let rota = "http://localhost:3000/gravandoAssentoVolta";


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