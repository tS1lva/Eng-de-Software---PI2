import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import { CustomResponse } from "./CustomResponse";
import { Aeronave } from "./Aeronave";
import { oraConnAttribs } from "./OracleConnAtribs";
import { rowsToAeronaves } from "./Conversores";
import { aeronaveValida } from "./Validadores";

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
app.put("/alterarAeronave", async (req, res)=>{
  console.log("\nEntrou no PUT! /alterarAeronave\n");
  // objeto para resposta
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined
  }

  const updateAero: Aeronave = req.body as Aeronave;
  const codigo = req.body.codigo as number;
  const modelo = req.body.modelo as string;

  let connection;
  try{
    const cmdUpdateAero =   `UPDATE AERONAVE 
                            SET 
                            MODELO = :1,
                            ANO_FABRI = :2,
                            FABRICANTE = :3
                            WHERE id_aeronave = :4`
    const dadosUpdate = [updateAero.modelo, updateAero.anoFabricacao,updateAero.fabricante, updateAero.codigo];//[modelo, codigo]

    console.log(`Dados que serao inseridos: ${dadosUpdate}`);

    connection = await oracledb.getConnection(oraConnAttribs);
    let resUpdateAero = await connection.execute(cmdUpdateAero, dadosUpdate);
    await connection.commit();

    const rowsInserted = resUpdateAero.rowsAffected;
    if(rowsInserted !== undefined &&  rowsInserted !== 0){
      console.log(`Linhas afetadas: ${resUpdateAero.rowsAffected}`);

      cr.status = "SUCCESS";
      cr.message = `${resUpdateAero.rowsAffected} linha(s) modificada(s).`;
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
});


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
});

//LISTEN Servidor Rodando na porta configurada: 3000
app.listen(port, ()=>{
  console.log("Servidor HTTP rodando...");
});

