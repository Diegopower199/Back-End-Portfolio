import { ObjectId } from "mongo";
import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { PartidoCollection } from "../db/dbconnection.ts";
import { PartidoSchema } from "../db/schema.ts";

type GetPartidoContext = RouterContext<
  "/listMatches",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const listMatches = async (context: GetPartidoContext) => {
  try {
    const matchesEncontrados: PartidoSchema[] | undefined =
      await PartidoCollection.find({
        finalizacion: false,
      }).toArray();

    if (matchesEncontrados) {
      context.response.body = matchesEncontrados.map((partido) => {
        return {
          _id: partido._id,
          nombreEquipo1: partido.nombreEquipo1,
          nombreEquipo2: partido.nombreEquipo2,
          resultado: partido.resultado,
          minutoJuego: partido.minutoJuego,
          finalizacion: partido.finalizacion,
        };
      });
      context.response.status = 200;
    } else {
      context.response.body = [];
      context.response.status = 404;
    }
  } catch (error) {
    context.response.status = 500;
  }
};

type GetPartidoConIDContext = RouterContext<
  "/getMatch/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getMatch = async (context: GetPartidoConIDContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (params?.id) {
      const partidoEncontrado: PartidoSchema | undefined =
        await PartidoCollection.findOne({
          _id: new ObjectId(params.id),
        });

      if (!partidoEncontrado) {
        context.response.body = {
          message: "Partido not found",
        };
        context.response.status = 404;
        return;
      }

      context.response.body = {
        _id: partidoEncontrado._id,
        nombreEquipo1: partidoEncontrado.nombreEquipo1,
        nombreEquipo2: partidoEncontrado.nombreEquipo2,
        resultado: partidoEncontrado.resultado,
        minutoJuego: partidoEncontrado.minutoJuego,
        finalizacion: partidoEncontrado.finalizacion,
      };
      context.response.status = 200;
    }
  } catch (error) {
    context.response.status = 500;
  }
};
