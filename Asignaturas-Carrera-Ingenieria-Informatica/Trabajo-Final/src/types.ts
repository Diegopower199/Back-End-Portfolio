export enum tipoUsuario {
  REGISTRADO_NORMAL = "REGISTRADO NORMAL",
  REGISTRADO_AUTOR = "REGISTRADO AUTOR",
}
export type Usuario = {
  id: string;
  username: string;
  password?: string;
  token?: string;
  fechaCreacion: Date;
  tipoUsuario: tipoUsuario;
  postCreados: string[];
  inicioSesionCuenta: boolean;
};

export type Post = {
  id: string;
  title: string;
  contenido: string;
  comentarios: string[];
  fechaPost: Date;
};
export type Comentario = {
  id: string;
  contenido: string;
  fechaCreacion: Date;
};
