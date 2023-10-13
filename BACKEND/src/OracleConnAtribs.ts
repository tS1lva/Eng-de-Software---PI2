/***
 * Esse arquivo é muito interessante. 
 * Nele criamos uma constante chamada oraConnAttribs. 
 * Sempre que desejarmos usar ela em qualquer código, basta importarmos ;-) 
 * Chique né?
 */

import {ConnectionAttributes} from "oracledb";
import dotenv from "dotenv";

// já configurando e preparando o uso do dotenv para 
// todos os serviços.
dotenv.config();

export const oraConnAttribs: ConnectionAttributes = {
  user: process.env.ORACLE_DB_USER,
  password: process.env.ORACLE_DB_PASSWORD,
  connectionString: process.env.ORACLE_CONN_STR,
}