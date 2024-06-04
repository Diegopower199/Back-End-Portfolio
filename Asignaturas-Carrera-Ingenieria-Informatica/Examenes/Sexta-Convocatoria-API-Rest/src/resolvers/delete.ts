import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventosCollection } from "../db/mongo.ts";

type RemoveEventContext = RouterContext<
  "/deleteEvent/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeEvent = async (context: RemoveEventContext) => {
  try {
    const id = context.params.id;

    if (!id) {
      context.response.body = {
        message: "Falta el id",
      };
      context.response.status = 400;
      return;
    }

    const eventoEncontrado = await eventosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!eventoEncontrado) {
      context.response.body = {
        message: "No existe el evento",
      };
      context.response.status = 404;
      return;
    }

    await eventosCollection.deleteOne({ _id: new ObjectId(id) });

    context.response.body = "Evento eliminado";
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
