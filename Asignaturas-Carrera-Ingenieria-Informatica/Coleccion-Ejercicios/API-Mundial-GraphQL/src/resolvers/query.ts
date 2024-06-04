import { ObjectId } from "mongo";
import { EquiposCollection, PartidosCollection } from "../db/database.ts";
import { Equipo, Partido, Status } from "../types.ts";

export const Query = {
  getEquipo: async (
    _: unknown,
    args: { id: string }
  ): Promise<Equipo | null> => {
    try {
      const equipoEncontrado = await EquiposCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!equipoEncontrado) {
        return null;
      }

      return { ...equipoEncontrado };
    } catch (error) {
      throw new Error(error);
    }
  },

  getEquipos: async (
    _: unknown,
    args: { eliminado?: boolean; jugando?: boolean }
  ): Promise<Equipo[] | null> => {
    try {
      const equipos = await EquiposCollection.find().toArray();

      if (args.eliminado || !args.eliminado) {
        return equipos.filter((equipo: Equipo) => {
          return equipo.eliminado === args.eliminado;
        });
      }

      if (args.jugando || !args.jugando) {
        const partido = await PartidosCollection.find({
          estado: args.jugando,
        }).toArray();

        const equipo = partido.map((partido: Partido) => {
          return partido.equipo1;
        });

        return equipo.map((equipo: Equipo) => {
          return { ...equipo };
        });
      }

      if (!equipos) {
        return null;
      }

      return equipos.map((equipo: Equipo) => {
        return { ...equipo };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  getPartido: async (
    _: unknown,
    args: { id: string }
  ): Promise<Partido | null> => {
    try {
      const partidoEncontrado = await PartidosCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!partidoEncontrado) {
        return null;
      }

      return { ...partidoEncontrado };
    } catch (error) {
      throw new Error(error);
    }
  },

  getPartidos: async (
    _: unknown,
    args: { status: Status; equipo?: string }
  ): Promise<Partido[] | null> => {
    try {
      if (!args.status) {
        throw new Error("El estado es obligatorio");
      }

      const partidos = await PartidosCollection.find().toArray();

      const partidosEstado = partidos.filter((partido: Partido) => {
        return partido.estado === args.status;
      });

      if (!partidosEstado) {
        return null;
      }

      return partidosEstado.map((partido: Partido) => {
        return { ...partido };
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
