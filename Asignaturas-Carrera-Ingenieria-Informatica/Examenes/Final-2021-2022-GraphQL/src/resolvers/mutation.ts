import { ObjectId } from "mongo";
import { MatchCollection } from "../db/dbconnection.ts";
import { MatchSchema } from "../db/schema.ts";

export const Mutation = {
  setMatchData: async (
    _: unknown,
    args: { id: string; result: string; minute: number; ended: boolean }
  ): Promise<MatchSchema> => {
    try {
      if (args.minute <= 0 || args.minute > 90) {
        throw new Error("Los minutos tienen que estar entre 1 y 90 minutos");
      }

      const matchEncontrado: MatchSchema | undefined =
        await MatchCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!matchEncontrado) {
        throw new Error("No existe el partido");
      }

      if (matchEncontrado?.minutoJuego > args.minute) {
        throw new Error("Los minutos deben ser superiores al valor anterior");
      }

      if (/^[0-9]{1}[-]{1}[0-9]{1}$/.test(args.result)) {
        throw new Error("El resultado debe tener un digito - y otro digito");
      }

      const _id = new ObjectId(args.id);
      const match = await MatchCollection.updateOne(
        { _id },
        {
          $set: {
            result: args.result,
            minute: args.minute,
            ended: args.ended,
          },
        }
      );

      if (match.matchedCount === 0) {
        throw new Error("No se ha encontrado el match");
      }

      return (await MatchCollection.findOne({
        _id,
      })) as MatchSchema;
    } catch (error) {
      throw new Error(error);
    }
  },

  startMatch: async (
    _: unknown,
    args: { team1: string; team2: string }
  ): Promise<MatchSchema> => {
    try {
      let comprobarEquipo1: MatchSchema | undefined =
        await MatchCollection.findOne({
          nombreEquipo1: args.team1,
        });

      let comprobarEquipo2: MatchSchema | undefined =
        await MatchCollection.findOne({
          nombreEquipo1: args.team2,
        });

      if (!comprobarEquipo1?.finalizacion || !comprobarEquipo2?.finalizacion) {
        throw new Error("Un equipo esta ya en partido 1");
      }

      comprobarEquipo1 = await MatchCollection.findOne({
        nombreEquipo2: args.team1,
      });

      comprobarEquipo2 = await MatchCollection.findOne({
        nombreEquipo2: args.team2,
      });

      if (!comprobarEquipo1?.finalizacion || !comprobarEquipo2?.finalizacion) {
        throw new Error("Un equipo esta ya en partido 2");
      }

      const match: ObjectId = await MatchCollection.insertOne({
        nombreEquipo1: args.team1,
        nombreEquipo2: args.team2,
        resultado: "0-0",
        minutoJuego: 0,
        finalizacion: false,
      });

      return {
        _id: match,
        nombreEquipo1: args.team1,
        nombreEquipo2: args.team2,
        resultado: "0-0",
        minutoJuego: 0,
        finalizacion: false,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
