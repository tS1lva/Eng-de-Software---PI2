import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import { CustomResponse } from "./CustomResponse";
import { Aeronave } from "./Aeronave";
import { Cidade } from "./Cidade";
import { Aeroporto } from "./Aeroportos";
import { Trecho } from "./trecho";
import { Voo } from "./voo";
import { oraConnAttribs } from "./OracleConnAtribs";
import { rowsToAeronaves, rowsToCidades, rowsToAeroportos, rowsToTrechos, rowsToVoos } from "./Conversores";
import { aeronaveValida, cidadeValida, aeroportoValida, trechoValida, vooValida } from "./Validadores";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Acertando a saída dos registros oracle em array puro javascript.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


//GET Obter Aeronaves do BD
app.get("/obterAeronaves", async (req, res) => {
  console.log("\nEntrou no GET! /obterAeronaves\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    // Modifique a consulta SQL para incluir o campo "codigo"
    let resultadoConsulta = await connection.execute("SELECT id_aeronave, modelo, ano_fabri, fabricante  FROM AERONAVE ORDER BY id_aeronave");

    //await connection.close();APAGAR
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToAeronaves(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.error(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});


//PUT Inserindo Aeronaves no BD
app.put("/inserirAeronave", async(req,res)=>{
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
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };


  const aero: Aeronave = req.body as Aeronave;
  console.log(aero);

  let [valida, mensagem] = aeronaveValida(aero);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  }else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdInsertAero = `INSERT INTO AERONAVE  
      (id_aeronave, modelo, ano_fabri, fabricante)
      VALUES
      (SEQ_AERONAVE.NEXTVAL, :1, :2, :3)`
      const dados = [aero.modelo, aero.anoFabricacao, aero.fabricante];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave inserida.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

//PUT Alterando Aeronaves no BD
app.put("/alterarAeronave", async (req, res) => {
  console.log("\nEntrou no PUT! /alterarAeronave\n");

  // Objeto de resposta
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aero: Aeronave = req.body as Aeronave;

  let [valida, mensagem] = aeronaveValida(aero);
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

    connection = await oracledb.getConnection(oraConnAttribs);
    let resUpdateAero = await connection.execute(cmdUpdateAero, dadosUpdate);
    await connection.commit();

    const rowsUpdated = resUpdateAero.rowsAffected;
    if (rowsUpdated !== undefined && rowsUpdated !== 0) {
      console.log(`Linhas afetadas: ${rowsUpdated}`);

      cr.status = "SUCCESS";
      cr.message = `${rowsUpdated} linha(s) modificada(s).`;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
);

//DELETE Excluindo Aeronaves do BD
app.delete("/excluirAeronave", async(req,res)=>{
  console.log("\nEntrou no DELETE! /excluirAeronave\n")
  // excluindo a aeronave pelo código dela:
  const codigo = req.body.codigo as number;
  console.log('Codigo recebido: ' + codigo);
 
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  // conectando 
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    const cmdDeleteAero = `DELETE AERONAVE WHERE id_aeronave = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAero, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave excluída.";
    }else{
      cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection!==undefined)
    await connection.close();
    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
  console.log(`codigo da aeronave deletada ${codigo}`)
});

//GET Obter cidades do BD
app.get("/obterCidades", async (req, res) => {
  console.log("\nEntrou no GET! /obterCidades\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    // Modifique a consulta SQL para incluir o campo "codigo"
    let resultadoConsulta = await connection.execute("SELECT id_cidade, nome from CIDADE ORDER BY id_cidade");

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToCidades(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.error(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

//PUT Inserindo cidades no BD
app.put("/inserirCidade",async (req, res)=>{
  console.log("\nEntrou no PUT! /InserirCidade\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const cida: Cidade = req.body as Cidade;
  console.log(cida);

  let [valida, mensagem] = cidadeValida(cida);
  if(!valida) {
    cr.message = mensagem;
      res.send(cr);
    }else {
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO CIDADE  
        (id_cidade, nome)
        VALUES
        (SEQ_CIDADE.NEXTVAL, :1)`
        const dados = [cida.nome];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "cidade inserida.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
});

//PUT Alterar cidades no BD
app.put("/alterarCidade", async (req, res) => {
    console.log("\nEntrou no PUT! /alterarCidade\n");
  
    // Objeto de resposta
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    const cida: Cidade = req.body as Cidade;
  
    let [valida, mensagem] = cidadeValida(cida);
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
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resUpdateCida = await connection.execute(cmdUpdateCida, dadosUpdate);
      await connection.commit();
  
      const rowsUpdated = resUpdateCida.rowsAffected;
      if (rowsUpdated !== undefined && rowsUpdated !== 0) {
        console.log(`Linhas afetadas: ${rowsUpdated}`);
  
        cr.status = "SUCCESS";
        cr.message = `${rowsUpdated} linha(s) modificada(s).`;
      }
    } catch (e) {
      if (e instanceof Error) {
        cr.message = e.message;
        console.log(e.message);
      } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
      }
    }finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
    }
);

//DELETE Excluindo cidades do BD
app.delete("/excluirCidade", async(req,res)=>{
  console.log("\nEntrou no DELETE! /excluirCidade\n")

  const codigo = req.body.codigo as number;
  console.log('Codigo recebido: ' + codigo);
 
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  // conectando 
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    const cmdDeleteCida = `DELETE CIDADE WHERE id_cidade = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteCida, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "cidade excluída.";
    }else{
      cr.message = "cidade não excluída. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection!==undefined)
    await connection.close();
    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

//GET Obter Aeroportos no BD
app.get("/obterAeroporto", async (req, res) => {
  console.log("\nEntrou no GET! /obterAeroporto\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    // Modifique a consulta SQL para incluir o campo "codigo"
    let resultadoConsulta = await connection.execute("SELECT id_aeroporto, nome, cidade_id FROM AEROPORTO ORDER BY id_aeroporto");

    //await connection.close();APAGAR
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToAeroportos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.error(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

//PUT Inserindo Aeroportos no BD
app.put("/inserirAeroporto", async(req,res)=>{
  console.log("\nEntrou no PUT! /inserirAeroporto\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };


  const aeropt: Aeroporto = req.body as Aeroporto;
  console.log(aeropt);

  let [valida, mensagem] = aeroportoValida(aeropt);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  }else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdInsertAeropt = `INSERT INTO AEROPORTO  
      (id_aeroporto, nome, cidade_id)
      VALUES
      (SEQ_AEROPORTO.NEXTVAL, :1, :2)`
      const dados = [aeropt.nome, aeropt.cidade_id];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAeropt, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeroporto inserido.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

//PUT Alterar Aeroportos no BD
app.put("/alterarAeroporto", async (req, res) => {
  console.log("\nEntrou no PUT! /alterarAeroporto\n");

  // Objeto de resposta
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aeropt: Aeroporto = req.body as Aeroporto;

  let [valida, mensagem] = aeroportoValida(aeropt);
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

    connection = await oracledb.getConnection(oraConnAttribs);
    let resUpdateAeropt = await connection.execute(cmdUpdateAeropt, dadosUpdate);
    await connection.commit();

    const rowsUpdated = resUpdateAeropt.rowsAffected;
    if (rowsUpdated !== undefined && rowsUpdated !== 0) {
      console.log(`Linhas afetadas: ${rowsUpdated}`);

      cr.status = "SUCCESS";
      cr.message = `${rowsUpdated} linha(s) modificada(s).`;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
);

//DELETE Excluindo Aeroportos do BD
app.delete("/excluirAeroporto", async(req,res)=>{
  console.log("\nEntrou no DELETE! /excluirAeroporto\n")

  const codigo = req.body.codigo as number;
  console.log('Codigo recebido: ' + codigo);
 
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  // conectando 
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    const cmdDeleteAeropt = `DELETE AEROPORTO WHERE id_aeroporto = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAeropt, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeroporto excluída.";
    }else{
      cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection!==undefined)
    await connection.close();
    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

//GET Obter Trechos no BD
app.get("/obterTrecho", async (req, res) => {
  console.log("\nEntrou no GET! /obterTrecho\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    // Modifique a consulta SQL para incluir o campo "codigo"
    let resultadoConsulta = await connection.execute("SELECT id_trecho, tipo, cidade_origem, cidade_destino FROM TRECHO ORDER BY id_trecho");

    //await connection.close();APAGAR
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToTrechos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.error(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

//PUT Inserindo Trechos no BD
app.put("/inserirTrecho", async(req,res)=>{
  console.log("\nEntrou no PUT! /inserirTrecho\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };


  const trecho: Trecho = req.body as Trecho;
  console.log(trecho);

  let [valida, mensagem] = trechoValida(trecho);
  if(!valida) {

    cr.message = mensagem;
    res.send(cr);
  }else {

    let connection;
    try{
      const cmdInsertTrecho = `INSERT INTO TRECHO  
      (id_trecho, tipo, cidade_origem, cidade_destino)
      VALUES
      (SEQ_TRECHO.NEXTVAL, :1, :2, :3)`
      const dados = [trecho.tipo, trecho.cidade_origem, trecho.cidade_destino];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertTrecho, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Trecho inserido.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

//PUT Alterar Trechos no BD
app.put("/alterarTrecho", async (req, res) => {
  console.log("\nEntrou no PUT! /alterarTrecho\n");

  // Objeto de resposta
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const trecho: Trecho = req.body as Trecho;

  let [valida, mensagem] = trechoValida(trecho);
  if (!valida) {
    cr.message = mensagem;
    return res.send(cr);
  }

  let connection;
  try {
    const cmdUpdateTrecho = `UPDATE TRECHO 
                          SET 
                          tipo = :1,
                          cidade_origem = :2,
                          cidade_destino = :3
                          WHERE id_trecho = :4`;
    const dadosUpdate = [trecho.tipo, trecho.cidade_origem, trecho.cidade_destino, trecho.codigo];

    console.log(trecho);

    connection = await oracledb.getConnection(oraConnAttribs);
    let resUpdateTrecho = await connection.execute(cmdUpdateTrecho, dadosUpdate);
    await connection.commit();

    const rowsUpdated = resUpdateTrecho.rowsAffected;
    if (rowsUpdated !== undefined && rowsUpdated !== 0) {
      console.log(`Linhas afetadas: ${rowsUpdated}`);

      cr.status = "SUCCESS";
      cr.message = `${rowsUpdated} linha(s) modificada(s).`;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
);

//DELETE Excluindo Trechos do BD
app.delete("/excluirTrecho", async(req,res)=>{
  console.log("\nEntrou no DELETE! /excluirTrecho\n")

  const codigo = req.body.codigo as number;
  console.log('Codigo recebido: ' + codigo);
 
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  // conectando 
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    const cmdDeleteTrecho = `DELETE TRECHO WHERE id_trecho = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteTrecho, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Trecho excluído.";
    }else{
      cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection!==undefined)
    await connection.close();
    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

//GET Obter Voos no BD
app.get("/obterVoo", async (req, res) => {
  console.log("\nEntrou no GET! /obterVoo\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    // Modifique a consulta SQL para incluir o campo "codigo"
    let resultadoConsulta = await connection.execute("SELECT id_voo, hora_origem, data_origem, hora_chegada, data_chegada, aeroporto_origem, aeroporto_chegada, trecho_id, valor FROM VOO ORDER BY id_voo");

    //await connection.close();APAGAR
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToVoos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.error(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection !== undefined) {
      await connection.close();
    }
    res.send(cr);
  }
});

//PUT Inserindo Voos no BD
app.put("/inserirVoo", async(req,res)=>{
  console.log("\nEntrou no PUT! /inserirVoo\n");

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };


  const voo: Voo = req.body as Voo;
  console.log(voo);

  let [valida, mensagem] = vooValida(voo);
  if(!valida) {

    cr.message = mensagem;
    res.send(cr);
  }else {

    let connection;
    try{
      const cmdInsertVoo = `INSERT INTO VOO  
      (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, aeroporto_origem, aeroporto_chegada, trecho_id, valor)
      VALUES
      (SEQ_TRECHO.NEXTVAL, :1, :2, :3, :4, :5, :6, :7, :8)`
      const dados = [voo.hora_origem, voo.data_origem, voo.hora_chegada, voo.data_chegada, voo.aeroporto_origem, voo.aeroporto_chegada, voo.id_techo, voo.valor];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertVoo, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Voo inserido.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

//PUT Alterar Voos no BD
app.put("/alterarVoo", async (req, res) => {
  console.log("\nEntrou no PUT! /alterarVoos\n");

  // Objeto de resposta
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const voo: Voo = req.body as Voo;

  let [valida, mensagem] = vooValida(voo);
  if (!valida) {
    cr.message = mensagem;
    return res.send(cr);
  }

  let connection;
  try {
    const cmdUpdateVoo = `UPDATE VOO 
                          SET 
                          hora_origem = :1,
                          data_origem = :2,
                          hora_chegada = :3,
                          data_chegada = :4,
                          aeroporto_origem = :5,
                          aeroporto_chegada = :6,
                          trecho_id = :7,
                          valor = :8
                          WHERE id_voo = :9`;
    const dadosUpdate = [voo.hora_origem, voo.data_origem, voo.hora_chegada, voo.data_chegada, voo.aeroporto_origem, voo.aeroporto_chegada, voo.id_techo, voo.valor, voo.codigo];

    console.log(voo);

    connection = await oracledb.getConnection(oraConnAttribs);
    let resUpdateVoo = await connection.execute(cmdUpdateVoo, dadosUpdate);
    await connection.commit();

    const rowsUpdated = resUpdateVoo.rowsAffected;
    if (rowsUpdated !== undefined && rowsUpdated !== 0) {
      console.log(`Linhas afetadas: ${rowsUpdated}`);

      cr.status = "SUCCESS";
      cr.message = `${rowsUpdated} linha(s) modificada(s).`;
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
);

//DELETE Excluindo Voos do BD
app.delete("/excluirVoo", async(req,res)=>{
  console.log("\nEntrou no DELETE! /excluirVoo\n")

  const codigo = req.body.codigo as number;
  console.log('Codigo recebido: ' + codigo);
 
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  let connection;
  // conectando 
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    const cmdDeleteVoo = `DELETE VOO WHERE ID_VOO = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteVoo, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Voo excluído.";
    }else{
      cr.message = "Voo não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection!==undefined)
    await connection.close();
    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, ()=>{
  console.log("Servidor HTTP rodando...");
});