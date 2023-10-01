import express from "express";
import ora from "oracledb";
import dotenv from "dotenv";

const app = express();
const port = 3000;

const oracleStr = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-saopaulo-1.oraclecloud.com))(connect_data=(service_name=gd02426504b57b9_dbcompanhiaaerea_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

app.use(express.json());
app.use(express.static('public'));


 
app.get("/obterAeronaves", async(req, res)=>{
  console.log("\nEnctrou no GET! /obterAeronaves\n")
  // inicalizando o dotenv
  //dotenv.config();

  // o resultado pode ser a lista de aeronaves ou erro.
  let result;

  // primeiro: construir o objeto de CONEXAO.
  const connection = await ora.getConnection(
    { 
      user: "ADMIN", 
      password: "123456qwertY", //remover a senha em claro
      connectString: oracleStr
    });

  try{
    // tentando obter os dados...
    console.log("passou para tentando obter os dados...\n")
    result = await connection.execute("SELECT * FROM AERONAVES");
  }catch(erro){
    if(erro instanceof Error){
      console.log(`O detalhamento do erro é: ${erro.message}`)
    }else{
      console.log("Erro desconhecido.");
    }
    result = {
      error: "Erro ao obter aeronaves.",
    }
  }finally{
    if (connection){
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    res.send(result);
  }
});

app.put("/incluirAeronave", async (req, res) => {
  const connection = await ora.getConnection({
    user: "ADMIN",
    password: "123456qwertY",
    connectString: oracleStr,
  });

  try {
    console.log("Passou para INCLUIR AERONAVES...\n");

    // Os dados do formulário são acessados no objeto req.body
    const { campo1, campo2, campo3, campo4, campo5 } = req.body;
    console.log(campo1);
    console.log(campo2);
    console.log(campo3);
    console.log(campo4);
    console.log(campo5);


    // Verifique se os campos não estão vazios ou nulos e forneça valores padrão se necessário
    const codigo = campo1 || 9; // Valor padrão de 0 se campo1 estiver vazio ou nulo
    const marca = campo2 || 'Sem Marca'; // Valor padrão 'Sem Marca' se campo2 estiver vazio ou nulo
    const modelo = campo3 || 'Sem Modelo';
    const numeroAssentos = campo4 || 0;
    const registro = campo5 || 'Sem Registro';

    const sql = `INSERT INTO AERONAVES (CODIGO, MARCA, MODELO, NUMERO_ASSENTOS, REGISTRO) VALUES (:1, :2, :3, :4, :5)`;
    const binds = [codigo, marca, modelo, numeroAssentos, registro];

    await connection.execute(sql, binds);
    await connection.commit(); // Commit após a inserção bem-sucedida
    res.status(200).send("Inserção concluída com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    await connection.rollback(); // Em caso de erro, faça o rollback
    res.status(500).send("Erro ao inserir dados.");
  } finally {
    connection.close(); // Feche a conexão no bloco finally
  }
});




app.delete("/excluirAeronave", (req, res)=>{
  // excluir aeronave no Oracle.
});

app.listen(port, ()=>{
  console.log("Servidor HTTP rodando...");
});

