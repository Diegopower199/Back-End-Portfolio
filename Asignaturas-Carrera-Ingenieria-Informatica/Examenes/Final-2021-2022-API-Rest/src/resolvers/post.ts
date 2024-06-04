import { RouterContext } from "oak/router.ts";
import { PartidoCollection } from "../db/dbconnection.ts";
import { PartidoSchema } from "../db/schema.ts";
import { Partido } from "../types.ts";

type PostMatchContext = RouterContext<
  "/startMatch",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const startMatch = async (context: PostMatchContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.nombreEquipo1 || !value.nombreEquipo2) {
      context.response.status = 400;
      return;
    }

    if (typeof value.nombreEquipo1 !== "string") {
      context.response.status = 400;
      return;
    }

    if (typeof value.nombreEquipo2 !== "string") {
      context.response.status = 400;
      return;
    }

    let comprobarEquipo1: PartidoSchema | undefined =
      await PartidoCollection.findOne({
        nombreEquipo1: value.nombreEquipo1,
      });

    let comprobarEquipo2: PartidoSchema | undefined =
      await PartidoCollection.findOne({
        nombreEquipo1: value.nombreEquipo2,
      });

    if (!comprobarEquipo1?.finalizacion || !comprobarEquipo2?.finalizacion) {
      context.response.body = {
        message: "Un equipo esta ya en partido 1",
      };
      context.response.status = 400;
      return;
    }

    comprobarEquipo1 = await PartidoCollection.findOne({
      nombreEquipo2: value.nombreEquipo1,
    });

    comprobarEquipo2 = await PartidoCollection.findOne({
      nombreEquipo2: value.nombreEquipo2,
    });

    if (!comprobarEquipo1?.finalizacion || !comprobarEquipo2?.finalizacion) {
      context.response.body = {
        message: "Un equipo esta ya en partido 2",
      };
      context.response.status = 400;
      return;
    }

    const partido: Partial<Partido> = {
      nombreEquipo1: value.nombreEquipo1,
      nombreEquipo2: value.nombreEquipo2,
      resultado: "0-0",
      minutoJuego: 0,
      finalizacion: false,
    };

    const id = await PartidoCollection.insertOne(partido as PartidoSchema);
    partido.id = id;

    context.response.body = {
      id: partido.id,
      nombreEquipo1: partido.nombreEquipo1,
      nombreEquipo2: partido.nombreEquipo2,
      resultado: partido.resultado,
      minutoJuego: partido.minutoJuego,
      finalizacion: partido.finalizacion,
    };
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
