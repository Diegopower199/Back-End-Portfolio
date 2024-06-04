import { ObjectId } from "mongo";
import { Mensaje, Usuario } from "../types.ts";

export type UsuarioSchema = Omit<Usuario, "id" | "token"> & {
  _id: ObjectId;
};

export type MensajeSchema = Omit<Mensaje, "id"> & {
  _id: ObjectId;
};
