import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { eventosCollection } from "../db/mongo.ts";
import { EventosSchema } from "../db/schema.ts";
import { Eventos } from "../types.ts";

type PostEventosContext = RouterContext<
  "/addEvent",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postEvento = async (context: PostEventosContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (
      !value?.titulo ||
      !value?.fecha ||
      !value?.horaInicio ||
      !value?.horaFinal ||
      !value?.invitados
    ) {
      context.response.body = {
        message: "Faltan campos",
      };
      context.response.status = 400;
      return;
    }

    if (
      value.horaInicio < 0 ||
      value.horaInicio > 23 ||
      value.horaFinal < 0 ||
      value.horaFinal > 23
    ) {
      context.response.body = {
        message: "La horas horas deben estar entre las 0 y las 23",
      };
      context.response.status = 400;
      return;
    }

    if (value.horaInicio >= value.horaFinal) {
      context.response.body = {
        message: "La hora de inicio no puede ser mayor o igual a la hora final",
      };
      context.response.status = 400;
      return;
    }

    const comprobarEvento = await eventosCollection
      .find({ fecha: new Date(value.fecha) })
      .toArray();

    if (comprobarEvento.length > 0) {
      for (let i = 0; i < comprobarEvento.length; i++) {
        if (
          comprobarEvento[i].horaInicio <= value.horaInicio &&
          comprobarEvento[i].horaFinal >= value.horaInicio
        ) {
          context.response.body = {
            message: "Ya hay un evento en esa hora",
          };
          context.response.status = 400;
          return;
        }

        if (
          comprobarEvento[i].horaInicio <= value.horaFinal &&
          comprobarEvento[i].horaFinal >= value.horaFinal
        ) {
          context.response.body = {
            message: "Ya hay un evento en esa hora",
          };
          context.response.status = 400;
          return;
        }
      }
    }

    const newEvent: Partial<Eventos> = {
      titulo: value.titulo,
      descripcion: value.descripcion,
      fecha: new Date(value.fecha),
      horaInicio: value.horaInicio,
      horaFinal: value.horaFinal,
      invitados: value.invitados,
    };

    const id = await eventosCollection.insertOne(newEvent as EventosSchema);
    newEvent.id = id.toString();
    const { _id, ...eventosSinId } = newEvent as EventosSchema;

    context.response.body = eventosSinId;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
