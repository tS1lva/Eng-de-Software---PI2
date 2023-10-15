import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import { CustomResponse } from "./CustomResponse";
import { Aeronave } from "./Aeronave";
import { Cidade } from "./Cidade";
import { Aeroporto } from "./Aeroportos";
import { oraConnAttribs } from "./OracleConnAtribs";
import { rowsToAeronaves, rowsToCidades, rowsToAeroportos } from "./Conversores";
import { aeronaveValida, cidadeValida, aeroportoValida } from "./Validadores";

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
    let resultadoConsulta = await connection.execute("SELECT id_aeronave, modelo, ano_fabri, fabricante FROM AERONAVE");

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
    let resultadoConsulta = await connection.execute("SELECT id_cidade, nome from CIDADE");

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
  console.log("\nEntrou no PUT! /InserirAronave\n");

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
    let resultadoConsulta = await connection.execute("SELECT id_aeroporto, nome, cidade_id FROM AEROPORTO");

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

//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, ()=>{
  console.log("Servidor HTTP rodando...");
});


