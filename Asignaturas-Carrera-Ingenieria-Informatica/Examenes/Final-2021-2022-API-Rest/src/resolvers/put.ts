import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { PartidoCollection } from "../db/dbconnection.ts";

type PutMatchContext = RouterContext<
  "/setMatchData",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const setMatchData = async (context: PutMatchContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (typeof value.id !== "string") {
      context.response.body = {
        message: "el tipo de id debe ser string",
      };
      context.response.status = 400;
      return;
    }
    if (typeof value.resultado !== "string") {
      context.response.body = {
        message: "el tipo de resultado debe ser string",
      };
      context.response.status = 400;
      return;
    }
    if (typeof value.minutoJuego !== "number") {
      context.response.body = {
        message: "el tipo de minutoJuego debe ser number",
      };
      context.response.status = 400;
      return;
    }
    if (typeof value.finalizacion !== "boolean") {
      context.response.body = {
        message: "el tipo de finalizacion debe ser boolean",
      };
      context.response.status = 400;
      return;
    }

    if (parseInt(value.minutoJuego) <= 0 || parseInt(value.minutoJuego) > 90) {
      context.response.body = {
        message: "Los minutos tienen que estar entre 1 y 90 minutos",
      };
      context.response.status = 400;
      return;
    }

    const matchEncontrado = await PartidoCollection.findOne({
      _id: new ObjectId(value.id),
    });

    if (matchEncontrado?.minutoJuego) {
      if (matchEncontrado?.minutoJuego > value.minutoJuego) {
        context.response.body = {
          message: "Los minutos deben ser superiores al valor anterior",
        };
        context.response.status = 400;
        return;
      }
    }

    if (/^[0-9]{1}[-]{1}[0-9]{1}$/.test(value.resultado)) {
      context.response.body = {
        message: "El resultado debe tener un digito - y otro digito",
      };
      context.response.status = 400;
      return;
    }

    const count = await PartidoCollection.updateOne(
      { _id: new ObjectId(value.id) },
      {
        $set: {
          resultado: value.resultado,
          minutoJuego: value.minutoJuego,
          finalizacion: value.finalizacion,
        },
      }
    );

    if (count) {
      const matchEncontrado = await PartidoCollection.findOne({
        _id: new ObjectId(value.id),
      });

      context.response.body = {
        id: matchEncontrado?._id.toString(),
        resultado: matchEncontrado?.resultado,
        minutoJuego: matchEncontrado?.minutoJuego,
        finalizacion: matchEncontrado?.finalizacion,
      };
      context.response.status = 200;
      return;
    } else {
      context.response.body = {
        message:
          "Ningun dato se ha actualizado ya que no se encontraba el partido",
      };
      context.response.status = 404;
      return;
    }
  } catch (e) {
    throw new Error(e);
  }
};
