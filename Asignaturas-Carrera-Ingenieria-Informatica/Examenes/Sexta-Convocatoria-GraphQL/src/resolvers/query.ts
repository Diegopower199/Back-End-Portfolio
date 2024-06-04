import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { eventosCollection } from "../db/mongo.ts";
import { EventosSchema } from "../db/schema.ts";
import { Eventos } from "../types.ts";

export const Query = {
  events: async (): Promise<Eventos[]> => {
    try {
      const eventos = await eventosCollection.find({}).toArray();

      if (eventos.length === 0) {
        throw new Error("No hay eventos registrados");
      }

      const eventosConId: Eventos[] = eventos.map((evento: EventosSchema) => {
        const eventoConId = {
          id: evento._id.toString(),
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          fecha: evento.fecha,
          inicio: evento.inicio,
          fin: evento.fin,
          invitados: evento.invitados,
        };

        return eventoConId;
      });

      return eventosConId;
    } catch (error) {
      throw new Error(error);
    }
  },

  event: async (_: unknown, args: { id: string }): Promise<Eventos> => {
    try {
      if (!args.id) {
        throw new Error("Faltan datos");
      }

      const eventoEncontrado = await eventosCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!eventoEncontrado) {
        throw new Error("Evento no encontrado");
      }

      return {
        id: eventoEncontrado._id.toString(),
        ...eventoEncontrado,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
