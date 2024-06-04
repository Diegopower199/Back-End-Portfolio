import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { SlotsCollection } from "../db/dbconnection.ts";

type RemoveSlotContext = RouterContext<
  "/removeSlot",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteSlot = async (context: RemoveSlotContext) => {
  try {
    const day = context.request.url.searchParams.get("day");
    const month = context.request.url.searchParams.get("month");
    const year = context.request.url.searchParams.get("year");
    const hour = context.request.url.searchParams.get("hour");

    if (!day || !month || !year || !hour) {
      context.response.body = {
        msg: "Faltan datos",
      };
      context.response.status = 400;
      return;
    }

    const slotEncontrado = await SlotsCollection.findOne({
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hour: parseInt(hour),
    });

    if (!slotEncontrado) {
      context.response.body = {
        msg: "No existe el slot",
      };
      context.response.status = 404;
      return;
    }

    if (!slotEncontrado.available) {
      context.response.body = {
        msg: "El slot no está disponible",
      };
      context.response.status = 403;
      return;
    } else {
      await SlotsCollection.deleteOne({
        _id: new ObjectId(slotEncontrado._id),
      });

      context.response.body = {
        msg: "Slot eliminado",
      };
      context.response.status = 200;
    }
  } catch (error) {
    context.response.status = 500;
  }
};
