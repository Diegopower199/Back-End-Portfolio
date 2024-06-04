import { PartidosCollection } from "../db/database.ts";
import { EquipoSchema, PartidoSchema } from "../db/schema.ts";

export const Equipo = {
  partidos: async (parent: EquipoSchema): Promise<PartidoSchema[]> => {
    return await PartidosCollection.find({
      _id: { $in: parent.jugadores },
    }).toArray();
  },
};
