import { ObjectId } from "mongo";
import { Equipo, Partido } from "../types.ts";

export type EquipoSchema = Omit<
  Equipo,
  "id" | "golesFavor" | "golesContra" | "puntos" | "partidos"
> & {
  _id: ObjectId;
};

export type PartidoSchema = Omit<Partido, "id" | "equipo1" | "equipo2"> & {
  _id: ObjectId;
  equipo1: ObjectId;
  equipo2: ObjectId;
};
