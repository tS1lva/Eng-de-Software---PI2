"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const cors_1 = __importDefault(require("cors"));
const OracleConnAtribs_1 = require("./OracleConnAtribs");
const Conversores_1 = require("./Conversores");
const Validadores_1 = require("./Validadores");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Acertando a saída dos registros oracle em array puro javascript.
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
//GET Obter Aeronaves do BD
app.get("/obterAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterAeronaves\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_aeronave, modelo, ano_fabri, fabricante  FROM AERONAVE ORDER BY id_aeronave");
        //await connection.close();APAGAR
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToAeronaves)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//PUT Inserindo Aeronaves no BD
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /inserirAeronave\n");
    // para inserir a aeronave temos que receber os dados na requisição. 
    //****APAGAR****
    //const fabricante = req.body.fabricante as string;
    //const modelo = req.body.modelo as string;
    //const anoFabricação = req.body.anoFab as string;
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aero = req.body;
    console.log(aero);
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAero = `INSERT INTO AERONAVE  
      (id_aeronave, modelo, ano_fabri, fabricante)
      VALUES
      (SEQ_AERONAVE.NEXTVAL, :1, :2, :3)`;
            const dados = [aero.modelo, aero.anoFabricacao, aero.fabricante];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeronave inserida.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
//PUT Alterando Aeronaves no BD
app.put("/alterarAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /alterarAeronave\n");
    // Objeto de resposta
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aero = req.body;
    let [valida, mensagem] = (0, Validadores_1.aeronaveValida)(aero);
    if (!valida) {
        cr.message = mensagem;
        return res.send(cr);
    }
    let connection;
    try {
        const cmdUpdateAero = `UPDATE AERONAVE 
                          SET 
                          MODELO = :1,
                          ANO_FABRI = :2,
                          FABRICANTE = :3
                          WHERE id_aeronave = :4`;
        const dadosUpdate = [aero.modelo, aero.anoFabricacao, aero.fabricante, aero.codigo];
        console.log(aero);
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resUpdateAero = yield connection.execute(cmdUpdateAero, dadosUpdate);
        yield connection.commit();
        const rowsUpdated = resUpdateAero.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated !== 0) {
            console.log(`Linhas afetadas: ${rowsUpdated}`);
            cr.status = "SUCCESS";
            cr.message = `${rowsUpdated} linha modificada.`;
        }
        else {
            cr.message = "Não foi possivel encontrar o ID";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo Aeronaves do BD
app.delete("/excluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirAeronave\n");
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    // conectando 
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAero = `DELETE AERONAVE WHERE id_aeronave = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave excluída.";
        }
        else {
            cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
    console.log(`codigo da aeronave deletada ${codigo}`);
}));
//GET Obter cidades do BD
app.get("/obterCidades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterCidades\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_cidade, nome from CIDADE ORDER BY id_cidade");
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToCidades)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//PUT Inserindo cidades no BD
app.put("/inserirCidade", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /InserirCidade\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const cida = req.body;
    console.log(cida);
    let [valida, mensagem] = (0, Validadores_1.cidadeValida)(cida);
    if (!valida) {
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAero = `INSERT INTO CIDADE  
        (id_cidade, nome)
        VALUES
        (SEQ_CIDADE.NEXTVAL, :1)`;
            const dados = [cida.nome];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAero, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "cidade inserida.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
//PUT Alterar cidades no BD
app.put("/alterarCidade", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /alterarCidade\n");
    // Objeto de resposta
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const cida = req.body;
    let [valida, mensagem] = (0, Validadores_1.cidadeValida)(cida);
    if (!valida) {
        cr.message = mensagem;
        return res.send(cr);
    }
    let connection;
    try {
        const cmdUpdateCida = `UPDATE CIDADE 
                            SET 
                            NOME = :1
                            WHERE id_cidade = :2`;
        const dadosUpdate = [cida.nome, cida.codigo];
        console.log(cida);
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resUpdateCida = yield connection.execute(cmdUpdateCida, dadosUpdate);
        yield connection.commit();
        const rowsUpdated = resUpdateCida.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated !== 0) {
            console.log(`Linhas afetadas: ${rowsUpdated}`);
            cr.status = "SUCCESS";
            cr.message = `${rowsUpdated} linha modificada.`;
        }
        else {
            cr.message = "Não foi possivel encontrar o ID";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo cidades do BD
app.delete("/excluirCidade", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirCidade\n");
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    // conectando 
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteCida = `DELETE CIDADE WHERE id_cidade = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteCida, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "cidade excluída.";
        }
        else {
            cr.message = "cidade não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
//GET Obter Aeroportos no BD
app.get("/obterAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterAeroporto\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_aeroporto, nome, cidade_id FROM AEROPORTO ORDER BY id_aeroporto");
        //await connection.close();APAGAR
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//PUT Inserindo Aeroportos no BD
app.put("/inserirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /inserirAeroporto\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aeropt = req.body;
    console.log(aeropt);
    let [valida, mensagem] = (0, Validadores_1.aeroportoValida)(aeropt);
    if (!valida) {
        // já devolvemos a resposta com o erro e terminamos o serviço.
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        // continuamos o processo porque passou na validação.
        let connection;
        try {
            const cmdInsertAeropt = `INSERT INTO AEROPORTO  
      (id_aeroporto, nome, cidade_id)
      VALUES
      (SEQ_AEROPORTO.NEXTVAL, :1, :2)`;
            const dados = [aeropt.nome, aeropt.cidade_id];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertAeropt, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeroporto inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
//PUT Alterar Aeroportos no BD
app.put("/alterarAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /alterarAeroporto\n");
    // Objeto de resposta
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aeropt = req.body;
    let [valida, mensagem] = (0, Validadores_1.aeroportoValida)(aeropt);
    if (!valida) {
        cr.message = mensagem;
        return res.send(cr);
    }
    let connection;
    try {
        const cmdUpdateAeropt = `UPDATE AEROPORTO 
                          SET 
                          NOME = :1,
                          cidade_id = :2
                          WHERE ID_AEROPORTO = :3`;
        const dadosUpdate = [aeropt.nome, aeropt.cidade_id, aeropt.codigo];
        console.log(aeropt);
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resUpdateAeropt = yield connection.execute(cmdUpdateAeropt, dadosUpdate);
        yield connection.commit();
        const rowsUpdated = resUpdateAeropt.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated !== 0) {
            console.log(`Linhas afetadas: ${rowsUpdated}`);
            cr.status = "SUCCESS";
            cr.message = `${rowsUpdated} linha modificada.`;
        }
        else {
            cr.message = "Não foi possivel encontrar o ID";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo Aeroportos do BD
app.delete("/excluirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirAeroporto\n");
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    // conectando 
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteAeropt = `DELETE AEROPORTO WHERE id_aeroporto = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAeropt, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto excluída.";
        }
        else {
            cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
//GET Obter Trechos no BD
app.get("/obterTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterTrecho\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_trecho, cidade_origem, cidade_destino FROM TRECHO ORDER BY id_trecho");
        //await connection.close();APAGAR
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToTrechos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//PUT Inserindo Trechos no BD
app.put("/inserirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /inserirTrecho\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const trecho = req.body;
    console.log(trecho);
    let [valida, mensagem] = (0, Validadores_1.trechoValida)(trecho);
    if (!valida) {
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        let connection;
        try {
            const cmdInsertTrecho = `INSERT INTO TRECHO  
      (id_trecho, cidade_origem, cidade_destino)
      VALUES
      (SEQ_TRECHO.NEXTVAL, :1, :2)`;
            const dados = [trecho.cidade_origem, trecho.cidade_destino];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertTrecho, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Trecho inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
//PUT Alterar Trechos no BD
app.put("/alterarTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /alterarTrecho\n");
    // Objeto de resposta
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const trecho = req.body;
    let [valida, mensagem] = (0, Validadores_1.trechoValida)(trecho);
    if (!valida) {
        cr.message = mensagem;
        return res.send(cr);
    }
    let connection;
    try {
        const cmdUpdateTrecho = `UPDATE TRECHO 
                          SET 
                          cidade_origem = :1,
                          cidade_destino = :2
                          WHERE id_trecho = :3`;
        const dadosUpdate = [trecho.cidade_origem, trecho.cidade_destino, trecho.codigo];
        console.log(trecho);
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resUpdateTrecho = yield connection.execute(cmdUpdateTrecho, dadosUpdate);
        yield connection.commit();
        const rowsUpdated = resUpdateTrecho.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated !== 0) {
            console.log(`Linhas afetadas: ${rowsUpdated}`);
            cr.status = "SUCCESS";
            cr.message = `${rowsUpdated} linha modificada.`;
        }
        else {
            cr.message = "Não foi possivel encontrar o ID";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo Trechos do BD
app.delete("/excluirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirTrecho\n");
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    // conectando 
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteTrecho = `DELETE TRECHO WHERE id_trecho = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteTrecho, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluído.";
        }
        else {
            cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
//GET Obter Voos no BD
app.get("/obterVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterVoo\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_voo, hora_origem, data_origem, hora_chegada, data_chegada, aeroporto_origem, aeroporto_chegada, trecho_id, aeronave_id, valor FROM VOO ORDER BY id_voo");
        //await connection.close();APAGAR
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToVoos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//PUT Inserindo Voos no BD
app.put("/inserirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /inserirVoo\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    console.log(voo);
    let [valida, mensagem] = (0, Validadores_1.vooValida)(voo);
    if (!valida) {
        cr.message = mensagem;
        res.send(cr);
    }
    else {
        let connection;
        try {
            const cmdInsertVoo = `INSERT INTO VOO  
      (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor)
      VALUES
      (SEQ_TRECHO.NEXTVAL, :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, TO_DATE(:4, 'YYYY-MM-DD'),:5, :6, :7)`;
            const dados = [voo.hora_origem, voo.data_origem, voo.hora_chegada, voo.data_chegada, voo.trecho_id, voo.aeronave_id, voo.valor];
            connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
            let resInsert = yield connection.execute(cmdInsertVoo, dados);
            // importante: efetuar o commit para gravar no Oracle.
            yield connection.commit();
            // obter a informação de quantas linhas foram inseridas. 
            // neste caso precisa ser exatamente 1
            const rowsInserted = resInsert.rowsAffected;
            if (rowsInserted !== undefined && rowsInserted === 1) {
                cr.status = "SUCCESS";
                cr.message = "Voo inserido.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.log(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao oracle. Sem detalhes";
            }
        }
        finally {
            //fechar a conexao.
            if (connection !== undefined) {
                yield connection.close();
            }
            res.send(cr);
        }
    }
}));
//PUT Alterar Voos no BD
app.put("/alterarVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /alterarVoos\n");
    // Objeto de resposta
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    let [valida, mensagem] = (0, Validadores_1.vooValida)(voo);
    if (!valida) {
        cr.message = mensagem;
        return res.send(cr);
    }
    let connection;
    try {
        const cmdUpdateVoo = `UPDATE VOO 
                          SET 
                          hora_origem = :1,
                          data_origem = TO_DATE(:2, 'YYYY-MM-DD'),
                          hora_chegada = :3,
                          data_chegada = TO_DATE(:4, 'YYYY-MM-DD'),
                          aeroporto_origem = :5,
                          aeroporto_chegada = :6,
                          trecho_id = :7,
                          aeronave_id = :8,
                          valor = :9
                          WHERE id_voo = :10`;
        const dadosUpdate = [voo.hora_origem, voo.data_origem, voo.hora_chegada, voo.data_chegada, voo.aeroporto_origem, voo.aeroporto_chegada, voo.trecho_id, voo.aeronave_id, voo.valor, voo.codigo];
        console.log(voo);
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resUpdateVoo = yield connection.execute(cmdUpdateVoo, dadosUpdate);
        yield connection.commit();
        const rowsUpdated = resUpdateVoo.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated !== 0) {
            console.log(`Linhas afetadas: ${rowsUpdated}`);
            cr.status = "SUCCESS";
            cr.message = `${rowsUpdated} linha modificada.`;
        }
        else {
            cr.message = "Não foi possivel encontrar o ID";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo Voos do BD
app.delete("/excluirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirVoo\n");
    const codigo = req.body.codigo;
    console.log('Codigo recebido: ' + codigo);
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    // conectando 
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        const cmdDeleteVoo = `DELETE VOO WHERE ID_VOO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteVoo, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo excluído.";
        }
        else {
            cr.message = "Voo não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
//GET OBTER ASSENTO
app.get("/obterAssento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterAssento\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Modifique a consulta SQL para incluir o campo "codigo"
        let resultadoConsulta = yield connection.execute("SELECT id_assento, voo_id, linha, coluna FROM ASSENTO ORDER BY id_assento");
        //await connection.close();APAGAR
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToAssentos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
/* METODOS DA AREA DO CLIENTE ********************************************************* */
let filtro = undefined; // Inicializado como undefined
app.put("/Filtro", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /Filtro\n");
    let ax = req.body;
    console.log(ax);
    filtro = ax.codigo;
    console.log(filtro);
    res.send({ status: "SUCCESS", message: "Filtro atualizado com sucesso" });
}));
app.get("/exibirAssento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou do GET! /exibirAssento");
    let filtro = req.query.filtro; // Supondo que o filtro será passado como um parâmetro de consulta na URL
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        // Utilizar a variável filtro diretamente na consulta SQL
        let resultadoConsulta = yield connection.execute("SELECT id_assento, voo_id, linha, coluna FROM ASSENTO WHERE voo_id = :filtro ORDER BY id_assento", [filtro]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToAssentos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
app.get("/consultarVooCliente", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /consultarVooCliente\n");
    let dataPartida = req.query.data_origem;
    let aeroportoOrigem = req.query.aeroporto_origem;
    let aeroportoDestino = req.query.aeroporto_destino;
    if (!dataPartida) {
        return res.status(400).json({
            status: "ERROR",
            message: "O parâmetro 'data_origem' é obrigatório.",
            payload: undefined,
        });
    }
    console.log(dataPartida);
    console.log(aeroportoOrigem);
    console.log(aeroportoDestino);
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resultadoConsulta = yield connection.execute("SELECT id_voo, hora_origem, data_origem, hora_chegada, data_chegada, aeroporto_origem, aeroporto_chegada, trecho_id, aeronave_id, valor FROM VOO WHERE data_origem >= TO_DATE(:dataLimite, 'DD/MM/YY') AND aeroporto_origem = :1 AND aeroporto_chegada = :2 ORDER BY data_origem", [dataPartida, aeroportoOrigem, aeroportoDestino]);
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = (0, Conversores_1.rowsToVoos)(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
const assentosA = Array(1);
app.put("/gravandoAssentoIda", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT /gravandoAssentoIda");
    let assentoIDA = req.body;
    if (assentosA.length == 0) {
        assentosA.push(assentoIDA);
    }
    else {
        assentosA.pop();
        assentosA.push(assentoIDA);
    }
    console.log(assentosA[0]);
}));
app.put("/gravandoAssentoVolta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT /gravandoAssentoVolta");
    let assentoVolta = req.body;
    if (assentosA.length == 1) {
        assentosA.push(assentoVolta);
    }
    else {
        assentosA.pop();
        assentosA.push(assentoVolta);
    }
    console.log(assentosA[1]);
}));
//PUT Inserindo Assentos no BD
app.put("/InserirAssento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /InserirAssento\n");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    console.log("Corpo da requisição:", req.body);
    const assento = req.body;
    let connection;
    try {
        const cmdInsertVoo = `INSERT INTO ASSENTO  
    (id_assento, voo_id, linha, coluna)
    VALUES
    (SEQ_ASSENTO.NEXTVAL, :1, :2, :3)`;
        const dados = [assento.voo_id, assento.linha, assento.coluna];
        connection = yield oracledb_1.default.getConnection(OracleConnAtribs_1.oraConnAttribs);
        let resInsert = yield connection.execute(cmdInsertVoo, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        console.log(assento);
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Assento inserido.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (connection !== undefined) {
            yield connection.close();
        }
        res.send(cr);
    }
}));
//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
