import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/mongo.ts";

type RemoveSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeSlot = async (context: RemoveSlotContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params.year || !params.month || !params.day || !params.hour) {
      context.response.status = 406;
      return;
    }

    const { year, month, day, hour } = params;

    const slotEncontrado = await SlotsCollection.findOne({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
    });

    if (!slotEncontrado) {
      context.response.status = 404;
      return;
    }

    if (!slotEncontrado.available) {
      context.response.status = 403;
      return;
    }

    await SlotsCollection.deleteOne({ _id: slotEncontrado.id });

    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
