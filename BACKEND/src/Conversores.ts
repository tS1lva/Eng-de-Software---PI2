// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 

import { Aeronave } from "./Aeronave";
import { Cidade } from "./Cidade";
import { Aeroporto } from "./Aeroportos";
import { Trecho } from "./trecho";

export function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let aeronaves: Array<Aeronave> = [];
  let aeronave;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeronave = {
        codigo: registro.ID_AERONAVE,
        fabricante: registro.FABRICANTE,
        modelo: registro.MODELO,
        anoFabricacao: registro.ANO_FABRI,
      } as Aeronave;

      // inserindo o novo Array convertido.
      aeronaves.push(aeronave);
    })
  }
  return aeronaves;
}


export function rowsToCidades(oracleRows: unknown[] | undefined) : Array<Cidade> {
  
  let cidades: Array<Cidade> = [];
  let cidade;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      cidade = {
        codigo: registro.ID_CIDADE,
        nome: registro.NOME,
      } as Cidade;

      // inserindo o novo Array convertido.
      cidades.push(cidade);
    })
  }
  return cidades;
}


export function rowsToAeroportos(oracleRows: unknown[] | undefined) : Array<Aeroporto> {
  
  let Aeroportos: Array<Aeroporto> = [];
  let Aeroporto;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      Aeroporto = {
        codigo: registro.ID_AEROPORTO,
        nome: registro.NOME,
        cidade_id: registro.CIDADE_ID
      } as Aeroporto;

      // inserindo o novo Array convertido.
      Aeroportos.push(Aeroporto);
    })
  }
  return Aeroportos;
}


export function rowsToTrechos(oracleRows: unknown[] | undefined) : Array<Trecho> {
  
  let Trechos: Array<Trecho> = [];
  let Trecho;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      Trecho = {
        codigo: registro.ID_TRECHO,
        tipo: registro.TIPO,
        cidade_origem: registro.CIDADE_ORIGEM,
        cidade_destino: registro.CIDADE_DESTINO
      } as Trecho;

      // inserindo o novo Array convertido.
      Trechos.push(Trecho);
    })
  }
  return Trechos;
}