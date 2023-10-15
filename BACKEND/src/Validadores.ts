import { Aeronave } from "./Aeronave";

// neste arquivo colocaremos TODAS as funções de validação para todo tipo de objeto. 

// diferentemente de outras linguagens, podemos fazer uma função
// que possa retornar ou um booleano, ou uma string ou um tipo não definido.
// para que isso? se retornar TRUE no final significa que deu tudo certo. 
// se retornar uma string será o código de erro. 
export function aeronaveValida(aero: Aeronave) {

  let valida = false;
  let mensagem = "";

  if(aero.fabricante === undefined){
    mensagem = "Fabricante não informado";
  }

  if(aero.fabricante !== 'Embraer' && aero.fabricante !== 'Airbus' && aero.fabricante !== 'Boeing'){
    mensagem = "Fabricante deve ser: Embraer, Airbus ou Boeing.";
  }

  if(aero.modelo === undefined){
    mensagem = "Modelo não informado.";
  }

  if(aero.anoFabricacao === undefined){
    mensagem = "Ano de fabricação não informado";
  }

  if((aero.anoFabricacao!== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)){
    mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
  }
  if(mensagem === ""){
    valida = true;
  }

  return [valida, mensagem] as const;
}

//Validando cidade

import { Cidade } from "./Cidade";

export function cidadeValida(cida: Cidade) {

  let valida = false;
  let mensagem = "";

  if (cida.nome === undefined){
    mensagem = "Nome não informado";
  }
  if (mensagem === "") {
    valida = true;
  }

  return [valida, mensagem] as const;
}