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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv_1.default.config();
//GET Obter Aeronaves do BD
app.get("/obterAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no GET! /obterAeronaves\n");
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_PASSWORD,
            connectionString: process.env.ORACLE_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM AERONAVES");
        yield connection.close();
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = resultadoConsulta.rows;
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
        res.send(cr);
    }
}));
//PUT Inserindo Aeronaves no BD
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no PUT! /inserirAeronave\n");
    // para inserir a aeronave temos que receber os dados na requisição. 
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const qtdeAssentos = req.body.qtdeAssentos;
    const registro = req.body.registro;
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
    let conn;
    // conectando 
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_PASSWORD,
            connectionString: process.env.ORACLE_CONN_STR,
        });
        const cmdInsertAero = `INSERT INTO AERONAVES 
    (CODIGO, MARCA, MODELO, NUMERO_ASSENTOS, REGISTRO)
    VALUES
    (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4)`;
        const dados = [marca, modelo, qtdeAssentos, registro];
        let resInsert = yield conn.execute(cmdInsertAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield conn.commit();
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
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
//DELETE Excluindo Aeronaves do BD
app.delete("/excluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nEntrou no DELETE! /excluirAeronave\n");
    // excluindo a aeronave pelo código dela:
    const codigo = req.body.codigo;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    // conectando 
    try {
        const connection = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_PASSWORD,
            connectionString: process.env.ORACLE_CONN_STR,
        });
        const cmdDeleteAero = `DELETE AERONAVES WHERE codigo = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield connection.commit();
        // encerrar a conexao. 
        yield connection.close();
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
        // devolvendo a resposta da requisição.
        res.send(cr);
    }
}));
//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
