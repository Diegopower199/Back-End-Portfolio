import { ObjectId } from "mongo";
import { EquiposCollection, PartidosCollection } from "../db/database";
import { Equipo, Partido, Status } from "../types";

export const Mutation = {
  addEquipo: async (
    _: unknown,
    args: { nombre: string; jugadores: string[] }
  ): Promise<Equipo> => {
    try {
      if (!args.nombre || !args.jugadores) {
        throw new Error("El nombre y los jugadores son obligatorios");
      }

      await EquiposCollection.insertOne({
        nombre: args.nombre,
        jugadores: args.jugadores,
        eliminado: false,
        golesFavor: 0,
        golesContra: 0,
        puntos: 0,
        partidos: 0,
      });

      return {
        nombre: args.nombre,
        jugadores: args.jugadores,
        eliminado: false,
        golesFavor: 0,
        golesContra: 0,
        puntos: 0,
        partidos: 0,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  addPartido: async (
    _: unknown,
    args: { equipo1: string; equipo2: string }
  ): Promise<Partido> => {
    try {
      if (!args.equipo1 || !args.equipo2) {
        throw new Error("Los equipos son obligatorios");
      }

      const equipo1Encontrado = await EquiposCollection.findOne({
        _id: new ObjectId(args.equipo1),
      });

      const equipo2Encontrado = await EquiposCollection.findOne({
        _id: new ObjectId(args.equipo2),
      });

      if (!equipo1Encontrado || !equipo2Encontrado) {
        throw new Error("Uno de los equipos o ambos no existen");
      }

      const partido: Partido = await PartidosCollection.insertOne({
        equipo1: new ObjectId(args.equipo1),
        equipo2: new ObjectId(args.equipo2),
        golesEquipo1: 0,
        golesEquipo2: 0,
        estado: Status.not_started,
        time: 0,
      });

      return {
        ...partido,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  updatePartido: async (
    _: unknown,
    args: {
      id: string;
      status?: Status;
      equipo1?: number;
      equipo2?: number;
      time?: number;
    }
  ): Promise<Partido> => {
    try {
      if (!args.id) {
        throw new Error("El id del partido es obligatorio");
      }

      const partidoEncontrado = await PartidosCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!partidoEncontrado) {
        throw new Error("El partido no existe");
      }

      const equipo1Encontrado = await EquiposCollection.findOne({
        _id: partidoEncontrado.equipo1,
      });

      const equipo2Encontrado = await EquiposCollection.findOne({
        _id: partidoEncontrado.equipo2,
      });

      if (!equipo1Encontrado || !equipo2Encontrado) {
        throw new Error("Uno de los equipos o ambos no existen");
      }

      const partidoUpdate = await PartidosCollection.updateOne(
        { _id: new ObjectId(args.id) },
        {
          $set: {
            estado: args.status ? args.status : partidoEncontrado.estado,
            golesEquipo1: args.equipo1
              ? args.equipo1
              : partidoEncontrado.golesEquipo1,
            golesEquipo2: args.equipo2
              ? args.equipo2
              : partidoEncontrado.golesEquipo2,
            time: args.time ? args.time : partidoEncontrado.time,
          },
        }
      );

      if (args.time === 90) {
        await PartidosCollection.updateOne(
          { _id: partidoEncontrado._id },
          { $set: { estado: Status.finished } }
        );
      } else {
        await PartidosCollection.updateOne(
          { _id: partidoEncontrado._id },
          { $set: { estado: Status.started } }
        );
      }

      if (args.time === 90) {
        await EquiposCollection.updateOne(
          { _id: equipo1Encontrado._id },
          { $set: { partidos: equipo1Encontrado.partidos + 1 } }
        );
        await EquiposCollection.updateOne(
          { _id: equipo2Encontrado._id },
          { $set: { partidos: equipo2Encontrado.partidos + 1 } }
        );

        await EquiposCollection.updateOne(
          { _id: equipo1Encontrado._id },
          {
            $set: {
              golesFavor:
                equipo1Encontrado.golesFavor + partidoEncontrado.golesEquipo1,
              golesContra:
                equipo1Encontrado.golesContra + partidoEncontrado.golesEquipo2,
            },
          }
        );

        await EquiposCollection.updateOne(
          { _id: equipo2Encontrado._id },
          {
            $set: {
              golesFavor:
                equipo2Encontrado.golesFavor + partidoEncontrado.golesEquipo2,
              golesContra:
                equipo2Encontrado.golesContra + partidoEncontrado.golesEquipo1,
            },
          }
        );

        if (partidoEncontrado.golesEquipo1 === partidoEncontrado.golesEquipo2) {
          await EquiposCollection.updateOne(
            { _id: equipo1Encontrado._id },
            { $set: { puntos: equipo1Encontrado.puntos + 1 } }
          );
          await EquiposCollection.updateOne(
            { _id: equipo2Encontrado._id },
            { $set: { puntos: equipo2Encontrado.puntos + 1 } }
          );
        } else if (
          partidoEncontrado.golesEquipo1 < partidoEncontrado.golesEquipo2
        ) {
          await EquiposCollection.updateOne(
            { _id: equipo1Encontrado._id },
            { $set: { puntos: equipo1Encontrado.puntos + 0 } }
          );
          await EquiposCollection.updateOne(
            { _id: equipo2Encontrado._id },
            { $set: { puntos: equipo2Encontrado.puntos + 3 } }
          );
        } else {
          await EquiposCollection.updateOne(
            { _id: equipo1Encontrado._id },
            { $set: { puntos: equipo1Encontrado.puntos + 3 } }
          );
          await EquiposCollection.updateOne(
            { _id: equipo2Encontrado._id },
            { $set: { puntos: equipo2Encontrado.puntos + 0 } }
          );
        }
      }

      return {
        ...partidoUpdate,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
