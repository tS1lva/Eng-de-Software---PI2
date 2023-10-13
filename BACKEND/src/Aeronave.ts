// vamos definir um tipo chamado Aeronave. 
// vai representar para nós a estrutura de dados do que é uma aeronave.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Aeronave = {
  codigo?: number, 
  fabricante?: string, 
  modelo?: string,
  anoFabricacao?: number, 
  //totalAssentos?: number,
  //referencia?: string
}