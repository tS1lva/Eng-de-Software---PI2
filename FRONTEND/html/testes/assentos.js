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
            coluna: converterLetraParaNumero(assentoData.coluna),
            linha: assentoData.linha,
          };
        });
      } else {
        throw new Error('Erro ao obter dados de assentos');
      }
    });
}

// Função para criar botões em uma grade
function criarBotoes() {
  const colunas = 4;
  const linhas = 5;
  const filtro = 1;

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
            const assentoClicado = assentos.find(assento => assento.coluna == coluna && assento.linha == linha);
            const numeroBotao = event.target.innerText;

            if (assentoClicado) {
                alert('Assento Reservado!');
                console.log(`Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`);
            } else {
                console.log(`Assento ${numeroBotao} - Coluna: ${coluna}, Linha: ${linha} clicado!`);

                if (event.target.classList.contains('assento-selecionado')) {
                    event.target.classList.remove('assento-selecionado');
                    event.target.classList.add('assento-disponivel');
                } else if (event.target.classList.contains('assento-disponivel')) {
                    const assentosSelecionados = document.querySelectorAll('.assento-selecionado');
                    
                    if (assentosSelecionados.length >= 1) {
                        alert('Deve ser comprado um assento por vez');
                        return;
                    }

                    event.target.classList.remove('assento-disponivel');
                    event.target.classList.add('assento-selecionado');
                    console.log("bilu");
                }
            }
        });

          linhaDiv.appendChild(botao);
        }

        document.body.appendChild(linhaDiv);
      }
    })
    .catch((error) => {
      console.error('Erro ao obter lista de assentos:', error.message);
    });
}
criarBotoes();