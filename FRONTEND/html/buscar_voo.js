var aeroportoOrigem = 1;
var aeroportoDestino = 1;
var aeroportoOrigemVolta = 1;
var aeroportoDestinoVolta = 1;
let botaoSalvarAssentoIDA = null;
let botaoSalvarAssentoVolta = null; 

function requestListaDeAeroportos() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/obterAeroporto', requestOptions)
        .then((response) => response.json());
}


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

    // Adicionando ouvinte de evento para o elemento aeroportoOrigemVolta
    selectAeroportoOrigemVolta.addEventListener("change", function () {
      const opcaoOrigemVolta = selectAeroportoOrigemVolta.value;
      console.log("Origem Volta:", opcaoOrigemVolta);
      aeroportoOrigemVolta = Number(opcaoOrigemVolta);
  });

  // Adicionando ouvinte de evento para o elemento aeroportoDestinoVolta
  selectAeroportoDestinoVolta.addEventListener("change", function () {
      const opcaoDestinoVolta = selectAeroportoDestinoVolta.value;
      console.log("Destino Volta:", opcaoDestinoVolta);
      aeroportoDestinoVolta = Number(opcaoDestinoVolta);
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

  function consultarVooClienteVolta() {
    return new Promise((resolve, reject) => {
      const dataVolta = new Date(document.getElementById("dataVolta").value);
      const dataLocal = new Date(dataVolta.getTime() - (dataVolta.getTimezoneOffset() * 60000));
      const dataFormatada = dataLocal.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      
      let rota = `http://localhost:3000/consultarVooCliente?data_origem=${dataFormatada}&aeroporto_origem=${aeroportoOrigemVolta}&aeroporto_destino=${aeroportoDestinoVolta}`;

  
      fetchObter(rota)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  var opcaoVoltaSelecionado = 0;
  function selecaoVooVolta() {
    opcaoVoltaSelecionado = 1 - opcaoVoltaSelecionado;
  
    console.log("Opcao de Volta Selecionada: " + opcaoVoltaSelecionado);

    if (opcaoVoltaSelecionado == 0){
      tabelaDivVolta = document.getElementById("DivTabelaVolta");
      tabelaDivVolta.style.display = "none";
    }
    return opcaoVoltaSelecionado;
  }


function exibirVoos() {
  const elementosAntigos = document.querySelectorAll('.linha');
  elementosAntigos.forEach(elemento => elemento.remove());
  const tblBody = document.getElementById("TblVoosDados");
  tblBody.innerHTML = ""; 
  const tblBody2 = document.getElementById("TblVoosDadosVolta");
  tblBody2.innerHTML = ""; 

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


  if (opcaoVoltaSelecionado == 1){
    console.log(' Entrou Consulta volta ' + opcaoVoltaSelecionado);
    tabelaDivVolta = document.getElementById("DivTabelaVolta");
    tabelaDivVolta.style.display = "block";

    consultarVooClienteVolta()
      .then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
          preencherTabelaVolta(customResponse.payload);

          const tabelaDivVolta = document.getElementById("DivTabelaVolta");
          tabelaDivVolta.style.display = "block";

        } else {
          console.log(customResponse.message);
        }
      })
      .catch((error) => {
        console.error("Erro ao exibir voos:", error);
      });
  }else{
      tabelaDivVolta.style.display = "none";
  }
      
}

function preencherTabela(voos) {
  const tblBody = document.getElementById("TblVoosDados");

  voos.forEach((voo) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="center">${voo.codigo}</td>
      <td class="leftText">${voo.nome_cidade_origem}</td>
      <td class="leftText">${voo.data_origem}</td>
      <td class="leftText">${voo.hora_origem}</td>
      <td class="leftText">${voo.nome_cidade_destino}</td>
      <td class="leftText">${voo.data_chegada}</td>
      <td class="leftText">${voo.hora_chegada}</td>
      <td class="rightText">${voo.valor}</td> 
      <td>
        <button class="btn btn-primary" onclick="criarBotoes(${voo.codigo},'DivMapaAssentos')">Escolher Assento</button>
      </td>`;

    tblBody.appendChild(row);
  });
}



function preencherTabelaVolta(voos) {
  const tblBodyVolta = document.getElementById("TblVoosDadosVolta");

  voos.forEach((voo) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="center">${voo.codigo}</td>
        <td class="leftText">${voo.nome_cidade_origem}</td>
        <td class="leftText">${voo.data_origem}</td>
        <td class="leftText">${voo.hora_origem}</td>
        <td class="leftText">${voo.nome_cidade_destino}</td>
        <td class="leftText">${voo.data_chegada}</td>
        <td class="leftText">${voo.hora_chegada}</td>
        <td class="rightText">${voo.valor}</td> 
        <td>
        <button class="btn btn-primary" onclick="criarBotoes(${voo.codigo},'DivMapaAssentos')">Escolher Assento</button>
      </td>`;

      tblBodyVolta.appendChild(row);
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
  // Criar botão "Salvar AssentoIDA"
  botaoSalvarAssentoIDA = document.createElement("button");
  botaoSalvarAssentoIDA.id = "botaoSalvarAssentoIDA"; // Defina um ID para referência posterior se necessário
  botaoSalvarAssentoIDA.innerHTML = "Confirmar Assento IDA";
  botaoSalvarAssentoIDA.classList.add('btn', 'btn-primary'); // Adiciona classes do Bootstrap
  botaoSalvarAssentoIDA.addEventListener("click", function () {
    inserirAssentoIda(Filtro);
  });

  return botaoSalvarAssentoIDA;
}



function criarBotaoSalvarAssentoVolta(Filtro) {
  // Criar botão "Salvar Assento Volta"
  botaoSalvarAssentoVolta = document.createElement("button");
  botaoSalvarAssentoVolta.id = "botaoSalvarAssentoVolta"; // Defina um ID para referência posterior se necessário
  botaoSalvarAssentoVolta.innerHTML = "Confirmar Assento VOLTA";
  botaoSalvarAssentoVolta.classList.add('btn', 'btn-primary'); // Adiciona classes do Bootstrap
  botaoSalvarAssentoVolta.addEventListener("click", function () {
    inserirAssentoVolta(Filtro);
  });

  return botaoSalvarAssentoVolta;
}



function criarDivComBotaoSalvar(Filtro) {
  // Criar div dinamicamente
  var minhaDiv = document.createElement("div");
  minhaDiv.id = "divConfirmarAssento"; // Definir o ID da div

  // Criar botão "Salvar Assento"
  var botaoSalvarAssentoIDA = criarBotaoSalvarAssentoIda(Filtro);
  var botaoSalvarAssentoVOLTA = criarBotaoSalvarAssentoVolta(Filtro);
  // Adicionar botão ao conteúdo da div
  DivMapaAssentos.appendChild(botaoSalvarAssentoIDA);
  minhaDiv.appendChild(botaoSalvarAssentoVOLTA);

  // Adicionar a div ao corpo do documento
  document.body.appendChild(minhaDiv);
}


/*
function limparDiv() {
  var minhaDiv = document.getElementById("divConfirmarAssento");
  if (minhaDiv) {
    minhaDiv.innerHTML = ""; // Limpa o conteúdo da div
    minhaDiv.remove(); // Remove a div do DOM
  }
}
*/

function limparDiv() {
  const divAssentoIDA = document.getElementById('divAssentoIDA'); // Substitua 'divAssentoIDA' pelo ID real da sua div
  divAssentoIDA.innerHTML = ''; // Limpa o conteúdo da div
}





function criarBotoes(Filtro, divPaiId) {
  //Div com id de destino
  const divPai = document.getElementById(divPaiId);

  //Remove todos os elementos filhos da div
  while (divPai.firstChild) {
    divPai.removeChild(divPai.firstChild);
  }

  //Cria um novo elemento div para conter a tabela, o bico e a cauda do avião
  const container = document.createElement('div');
  container.style.display = 'flex'; //Torna o container um contêiner flexível
  container.style.alignItems = 'center'; //Centraliza verticalmente os itens

  //Adiciona imagem do bico do avião à esquerda
  const imagemBico = document.createElement('img');
  imagemBico.src = 'aeronave-bico.png'; //Substitua pelo caminho da sua imagem
  imagemBico.alt = 'Bico do Avião';
  container.appendChild(imagemBico);

  // Cria um novo elemento tabela para conter os botões de assento
  const tabelaAssentos = document.createElement('table');
  tabelaAssentos.classList.add('tabela-assentos', 'table', 'table-bordered', 'table-hover'); // Adiciona classes do Bootstrap
  tabelaAssentos.style.marginTop = '20px'; // Adiciona margem superior


  // Remove a tabela de assentos existente, se houver
  const tabelaAntiga = document.querySelector('.tabela-assentos');
  if (tabelaAntiga) {
    tabelaAntiga.remove();
  }

  // Cria um novo elemento para exibir informações ao lado do ponteiro do mouse
  const infoMouse = document.createElement('div');
  infoMouse.style.position = 'absolute';
  infoMouse.style.display = 'none';
  document.body.appendChild(infoMouse);



  const colunas = 5;
  const linhas = 4;
  const filtro = Filtro;

  fetchListaDeAssentos(filtro)
    .then((assentos) => {
      for (let i = 0; i < linhas; i++) {
        const linha = tabelaAssentos.insertRow();

        for (let j = 0; j < colunas; j++) {
          const numeroBotao = i * colunas + j + 1;
          const celula = linha.insertCell();

          // Criar um botão com ícone do Bootstrap
          const botao = document.createElement('button');
          botao.setAttribute('data-coluna', j + 1);
          botao.setAttribute('data-linha', i + 1);
          botao.classList.add('assento', 'btn', 'btn-light'); // Adiciona classes do Bootstrap

          // Adiciona ícone do Bootstrap como filho do botão
          /*
          const icon = document.createElement('i');
          icon.classList.add('bi', 'bi-layout-sidebar-reverse'); // Classe do ícone do Bootstrap
          botao.appendChild(icon);*/

          const assentoReservado = assentos.find(
            (assento) => assento.coluna === j + 1 && assento.linha === i + 1
          );

          if (assentoReservado) {
            botao.classList.add('assento-reservado');
          } else {
            botao.classList.add('assento-disponivel');
          }

          // Adiciona evento de mouseover para exibir linha e coluna
          botao.addEventListener('mouseover', function (event) {
            const coluna = botao.getAttribute('data-coluna');
            const linha = botao.getAttribute('data-linha');
            const rect = event.target.getBoundingClientRect();

            // Posiciona o elemento infoMouse ao lado do ponteiro do mouse
            infoMouse.style.left = rect.right + 'px';
            infoMouse.style.top = rect.top + window.scrollY + 'px';
            infoMouse.style.display = 'block';

            // Atualiza o conteúdo do infoMouse
            infoMouse.innerHTML = `Linha: ${linha}, Coluna: ${coluna}`;
          });

          // Adiciona evento de mouseout para esconder infoMouse
          botao.addEventListener('mouseout', function () {
            infoMouse.style.display = 'none';
          });

          botao.addEventListener('click', function (event) {
            const coluna = event.target.getAttribute('data-coluna');
            const linha = event.target.getAttribute('data-linha');
            assento_clicado.linha = linha;
            assento_clicado.coluna = coluna;
            assento_clicado.voo_id = Filtro;
            const assentoClicado = assentos.find(
              (assento) => assento.coluna == coluna && assento.linha == linha
            );
            const numeroBotao = event.target.innerText;

            if (assentoClicado) {
              alert('Assento Reservado!');
              console.log(
                `Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`
              );
            } else {
              console.log(
                `Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`
              );
              assento_clicado.coluna = coluna;
              assento_clicado.linha = linha;
              if (event.target.classList.contains('assento-selecionado')) {
                event.target.classList.remove('assento-selecionado');
                event.target.classList.add('assento-disponivel');
                //limparDiv();
              } else if (
                event.target.classList.contains('assento-disponivel')
              ) {
                const assentosSelecionados = document.querySelectorAll(
                  '.assento-selecionado'
                );

                if (assentosSelecionados.length >= 1) {
                  alert('Deve ser comprado um assento por vez');
                  return;
                }
                event.target.classList.remove('assento-disponivel');
                event.target.classList.add('assento-selecionado');
                //criarDivComBotaoSalvar(Filtro);
                //limparDiv();
              }
            }




            if(opcaoVoltaSelecionado == 1){
              if (event.target.classList.contains('assento-selecionado')) {
                // Verifica se o voo é de volta
                if (opcaoVoltaSelecionado) {
                  // Cria o botão "Salvar Assento Volta"
                  botaoSalvarAssentoVolta = criarBotaoSalvarAssentoVolta(Filtro);
            
                  // Adiciona o botão à div que contém a tabela de assentos
                  divPai.appendChild(botaoSalvarAssentoVolta);
                }
              } else {
                // Remove o botão "Salvar Assento Volta" se o assento de volta for desmarcado
                if (botaoSalvarAssentoVolta) {
                  botaoSalvarAssentoVolta.remove();
                }
              }
            }else{

              if (event.target.classList.contains('assento-selecionado')) {
                // Cria o botão "Salvar AssentoIDA"
                botaoSalvarAssentoIDA = criarBotaoSalvarAssentoIda(Filtro);
            
                // Adiciona o botão à div que contém a tabela de assentos
                divPai.appendChild(botaoSalvarAssentoIDA);
              } else {
                // Remove o botão "Salvar AssentoIDA" se o assento for desmarcado
                if (botaoSalvarAssentoIDA) {
                  botaoSalvarAssentoIDA.remove();
                }
              }
            }



            

          });

          celula.appendChild(botao);
        }
      }

  // Adiciona a tabelaAssentos ao elemento container
  container.appendChild(tabelaAssentos);

  // Adiciona imagem da cauda do avião à direita
  const imagemCauda = document.createElement('img');
  imagemCauda.src = 'aeronave-cauda.png'; // Substitua pelo caminho da sua imagem
  imagemCauda.alt = 'Cauda do Avião';
  container.appendChild(imagemCauda);

  // Obtém a div de destino com base no ID fornecido
  const divPai = document.getElementById(divPaiId);

  // Adiciona o elemento container à divPai
  divPai.appendChild(container);
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