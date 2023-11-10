"use strict";
// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAssentos = exports.rowsToVoos = exports.rowsToTrechos = exports.rowsToAeroportos = exports.rowsToCidades = exports.rowsToAeronaves = void 0;
function rowsToAeronaves(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeronave
    let aeronaves = [];
    let aeronave;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeronave = {
                codigo: registro.ID_AERONAVE,
                fabricante: registro.FABRICANTE,
                modelo: registro.MODELO,
                anoFabricacao: registro.ANO_FABRI,
            };
            // inserindo o novo Array convertido.
            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}
exports.rowsToAeronaves = rowsToAeronaves;
function rowsToCidades(oracleRows) {
    let cidades = [];
    let cidade;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            cidade = {
                codigo: registro.ID_CIDADE,
                nome: registro.NOME,
            };
            // inserindo o novo Array convertido.
            cidades.push(cidade);
        });
    }
    return cidades;
}
exports.rowsToCidades = rowsToCidades;
function rowsToAeroportos(oracleRows) {
    let Aeroportos = [];
    let Aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            Aeroporto = {
                codigo: registro.ID_AEROPORTO,
                nome: registro.NOME,
                cidade_id: registro.CIDADE_ID
            };
            // inserindo o novo Array convertido.
            Aeroportos.push(Aeroporto);
        });
    }
    return Aeroportos;
}
exports.rowsToAeroportos = rowsToAeroportos;
function rowsToTrechos(oracleRows) {
    let Trechos = [];
    let Trecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            Trecho = {
                codigo: registro.ID_TRECHO,
                cidade_origem: registro.CIDADE_ORIGEM,
                cidade_destino: registro.CIDADE_DESTINO
            };
            // inserindo o novo Array convertido.
            Trechos.push(Trecho);
        });
    }
    return Trechos;
}
exports.rowsToTrechos = rowsToTrechos;
function rowsToVoos(oracleRows) {
    let Voos = [];
    let Voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            Voo = {
                codigo: registro.ID_VOO,
                hora_origem: registro.HORA_ORIGEM,
                data_origem: registro.DATA_ORIGEM,
                hora_chegada: registro.HORA_CHEGADA,
                data_chegada: registro.DATA_CHEGADA,
                aeroporto_origem: registro.AEROPORTO_ORIGEM,
                aeroporto_chegada: registro.AEROPORTO_CHEGADA,
                trecho_id: registro.TRECHO_ID,
                aeronave_id: registro.AERONAVE_ID,
                valor: registro.VALOR
            };
            // inserindo o novo Array convertido.
            Voos.push(Voo);
        });
    }
    return Voos;
}
exports.rowsToVoos = rowsToVoos;
function rowsToAssentos(oracleRows) {
    let Assentos = [];
    let Assento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            Assento = {
                id_assento: registro.ID_ASSENTO,
                voo_id: registro.VOO_ID,
                linha: registro.LINHA,
                coluna: registro.COLUNA,
            };
            // inserindo o novo Array convertido.
            Assentos.push(Assento);
        });
    }
    return Assentos;
}
exports.rowsToAssentos = rowsToAssentos;
