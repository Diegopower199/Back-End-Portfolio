export type Usuario = {
  id: string;
  username: string;
  password?: string;
  token?: string;
  fechaCreacion: Date;
  idioma: string;
};

export type Mensaje = {
  id: string;
  emisor: string;
  receptor: string;
  idioma: string;
  fechaCreacionMensaje: Date;
  contenido: string;
};

export type Context = {
  token?: string;
  lang?: string;
};
