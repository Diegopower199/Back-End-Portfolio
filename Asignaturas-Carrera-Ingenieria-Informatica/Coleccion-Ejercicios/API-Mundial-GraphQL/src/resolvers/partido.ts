import { ObjectId } from "mongo";
import { EquiposCollection } from "../db/database.ts";
import { EquipoSchema, PartidoSchema } from "../db/schema.ts";

export const Partido = {
  equipo1: (parent: PartidoSchema): Promise<EquipoSchema> => {
    return EquiposCollection.findOne({ _id: new ObjectId(parent.equipo1) });
  },

  equipo2: (parent: PartidoSchema): Promise<EquipoSchema> => {
    return EquiposCollection.findOne({ _id: new ObjectId(parent.equipo2) });
  },
};
