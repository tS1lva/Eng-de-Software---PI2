// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 

import { Aeronave } from "./Aeronave";
import { Cidade } from "./Cidade";
import { Aeroporto } from "./Aeroportos";
import { Trecho } from "./trecho";
import { Voo} from "./voo";
import { VooCliente } from "./vooCliente";
import { Assento } from "./Assento";

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
        cidade_origem: registro.CIDADE_ORIGEM,
        cidade_destino: registro.CIDADE_DESTINO
      } as Trecho;

      // inserindo o novo Array convertido.
      Trechos.push(Trecho);
    })
  }
  return Trechos;
}


export function rowsToVoos(oracleRows: unknown[] | undefined) : Array<Voo> {
  
  let Voos: Array<Voo> = [];
  let Voo;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      Voo = {
        codigo: registro.ID_VOO,
        hora_origem: registro.HORA_ORIGEM,
        data_origem: (registro.DATA_ORIGEM).toLocaleDateString(),
        hora_chegada: registro.HORA_CHEGADA,
        data_chegada: (registro.DATA_CHEGADA).toLocaleDateString(),
        aeroporto_origem: registro.AEROPORTO_ORIGEM,
        aeroporto_chegada: registro.AEROPORTO_CHEGADA,
        trecho_id: registro.TRECHO_ID,
        aeronave_id: registro.AERONAVE_ID,
        valor: registro.VALOR
      } as Voo;

      // inserindo o novo Array convertido.
      Voos.push(Voo);
    })
  }
  return Voos;
}

export function rowsToVoosCliente(oracleRows: unknown[] | undefined) : Array<VooCliente> {
  
  let VoosCliente: Array<VooCliente> = [];
  let VooCliente;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      VooCliente = {
        codigo: registro.ID_VOO,
        hora_origem: registro.HORA_ORIGEM,
        data_origem: (registro.DATA_ORIGEM).toLocaleDateString(),
        hora_chegada: registro.HORA_CHEGADA,
        data_chegada: (registro.DATA_CHEGADA).toLocaleDateString(),
        aeroporto_origem: registro.AEROPORTO_ORIGEM,
        aeroporto_chegada: registro.AEROPORTO_CHEGADA,
        trecho_id: registro.TRECHO_ID,
        aeronave_id: registro.AERONAVE_ID,
        valor: registro.VALOR,
        id_cidade_origem: registro.ID_CIDADE_ORIGEM,
        nome_cidade_origem: registro.NOME_CIDADE_ORIGEM,
        id_cidade_destino: registro.ID_CIDADE_DESTINO,
        nome_cidade_destino: registro.NOME_CIDADE_DESTINO
      } as VooCliente;

      // inserindo o novo Array convertido.
      VoosCliente.push(VooCliente);
    })
  }
  return VoosCliente;
}


export function rowsToAssentos(oracleRows: unknown[] | undefined) : Array<Assento> {
  
  let Assentos: Array<Assento> = [];
  let Assento;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      Assento = {
        id_assento: registro.ID_ASSENTO,
        voo_id: registro.VOO_ID,
        linha: registro.LINHA,
        coluna: registro.COLUNA,
      } as Assento;

      // inserindo o novo Array convertido.
      Assentos.push(Assento);
    })
  }
  return Assentos;
}

export function rowsToVoosDados(oracleRows: unknown[] | undefined): Array<Voo> {
  let Voos: Array<Voo> = [];

  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      const Voo: Voo = {
        codigo: registro.ID_VOO,
        hora_origem: registro.HORA_ORIGEM,
        data_origem: (registro.DATA_ORIGEM).toLocaleDateString(),
        hora_chegada: registro.HORA_CHEGADA,
        data_chegada: (registro.DATA_CHEGADA).toLocaleDateString(),
        aeroporto_origem: registro.AEROPORTO_ORIGEM_NOME, // Ajuste aqui
        aeroporto_chegada: registro.AEROPORTO_CHEGADA_NOME, // Ajuste aqui
        trecho_id: registro.TRECHO_ID,
        aeronave_id: registro.AERONAVE_ID,
        valor: registro.VALOR
      };

      // Inserindo o novo Array convertido.
      Voos.push(Voo);
    });
  }

  return Voos;
}