// criando um TIPO chamado CustomResponse.
// Esse tipo vamos sempre reutilizar.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type CustomResponse = {
  status: string,
  message: string,
  payload: any
};