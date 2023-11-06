"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vooValida = exports.trechoValida = exports.aeroportoValida = exports.cidadeValida = exports.aeronaveValida = void 0;
// neste arquivo colocaremos TODAS as funções de validação para todo tipo de objeto. 
// diferentemente de outras linguagens, podemos fazer uma função
// que possa retornar ou um booleano, ou uma string ou um tipo não definido.
// para que isso? se retornar TRUE no final significa que deu tudo certo. 
// se retornar uma string será o código de erro. 
function aeronaveValida(aero) {
    let valida = false;
    let mensagem = "";
    if (aero.fabricante === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aero.fabricante !== 'Embraer' && aero.fabricante !== 'Airbus' && aero.fabricante !== 'Boeing') {
        mensagem = "Fabricante deve ser: Embraer, Airbus ou Boeing.";
    }
    if (aero.modelo === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (aero.anoFabricacao === undefined) {
        mensagem = "Ano de fabricação não informado";
    }
    if ((aero.anoFabricacao !== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeronaveValida = aeronaveValida;
//Validando cidade
function cidadeValida(cida) {
    let valida = false;
    let mensagem = "";
    if (cida.nome === undefined) {
        mensagem = "Nome não informado";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.cidadeValida = cidadeValida;
//Validando Aeroporto
function aeroportoValida(aeropt) {
    let valida = false;
    let mensagem = "";
    if (aeropt.nome === undefined) {
        mensagem = "Nome não informado";
    }
    if (aeropt.cidade_id === undefined) {
        mensagem = "Id não informado";
    }
    if ((aeropt.cidade_id !== undefined) && aeropt.cidade_id < 1) {
        mensagem = "Id tem que ser maior que 0";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeroportoValida = aeroportoValida;
//Validando Trecho
function trechoValida(trecho) {
    let valida = false;
    let mensagem = "";
    if (trecho.cidade_origem === undefined) {
        mensagem = "Cidade origem não informado";
    }
    if (trecho.cidade_destino === undefined) {
        mensagem = "Cidade destino não informado";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.trechoValida = trechoValida;
//Validando Voo
function vooValida(voo) {
    let valida = false;
    let mensagem = "";
    if (voo.id_techo === undefined) {
        mensagem = "Trecho não informado";
    }
    if (voo.valor === undefined) {
        mensagem = "Preço não informado";
    }
    if ((voo.valor !== undefined) && (voo.valor < 500)) {
        mensagem = "Voo está muito barato";
    }
    if (voo.aeroporto_origem === undefined) {
        mensagem = "Aeroporto de origem não informado";
    }
    if (voo.aeroporto_chegada === undefined) {
        mensagem = "Aeroporto de chegada não informado";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.vooValida = vooValida;
