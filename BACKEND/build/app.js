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
        let resultadoConsulta = yield connection.execute("SELECT id_aeronave, modelo, ano_fabri, fabricante FROM AERONAVE");
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
            cr.message = `${rowsUpdated} linha(s) modificada(s).`;
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
//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
