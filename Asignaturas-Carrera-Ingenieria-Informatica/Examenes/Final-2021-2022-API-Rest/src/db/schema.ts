import { ObjectId } from "mongo";
import { Partido } from "../types.ts";

export type PartidoSchema = Omit<Partido, "id"> & {
  _id: ObjectId;
};
