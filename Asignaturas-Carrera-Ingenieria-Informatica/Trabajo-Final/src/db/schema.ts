import { ObjectId } from "mongo";
import { Comentario, Post, Usuario } from "../types.ts";

export type UsuarioSchema = Omit<Usuario, "id" | "token" | "postCreados"> & {
  _id: ObjectId;
  postCreados: ObjectId[];
};

export type PostSchema = Omit<Post, "id" | "comentarios"> & {
  _id: ObjectId;
  comentarios: ObjectId[];
};

export type ComentarioSchema = Omit<Comentario, "id"> & {
  _id: ObjectId;
};
