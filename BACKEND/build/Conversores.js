"use strict";
// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToCidades = exports.rowsToAeronaves = void 0;
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
