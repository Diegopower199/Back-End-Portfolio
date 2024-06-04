import { ObjectId } from "mongo";
import { MatchCollection } from "../db/dbconnection.ts";
import { MatchSchema } from "../db/schema.ts";

export const Query = {
  listMatches: async (_: unknown, args: {}): Promise<MatchSchema[]> => {
    try {
      const matchesEncontrados: MatchSchema[] = await MatchCollection.find({
        finalizacion: false,
      }).toArray();

      return matchesEncontrados.map((match: MatchSchema) => {
        return {
          _id: match._id,
          nombreEquipo1: match.nombreEquipo1,
          nombreEquipo2: match.nombreEquipo2,
          resultado: match.resultado,
          minutoJuego: match.minutoJuego,
          finalizacion: match.finalizacion,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  getMatch: async (_: unknown, args: { id: string }): Promise<MatchSchema> => {
    try {
      const matchEncontrado: MatchSchema | undefined =
        await MatchCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!matchEncontrado) {
        throw new Error("No existe el partido");
      }

      return {
        _id: matchEncontrado._id,
        nombreEquipo1: matchEncontrado.nombreEquipo1,
        nombreEquipo2: matchEncontrado.nombreEquipo2,
        resultado: matchEncontrado.resultado,
        minutoJuego: matchEncontrado.minutoJuego,
        finalizacion: matchEncontrado.finalizacion,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
