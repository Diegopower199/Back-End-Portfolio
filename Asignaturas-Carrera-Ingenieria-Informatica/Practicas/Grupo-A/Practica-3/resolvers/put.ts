import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/mongo.ts";

type PutBookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const bookSlot = async (context: PutBookSlotContext) => {
  try {
    const value = await context.request.body().value;

    if (
      !value.year ||
      !value.month ||
      !value.day ||
      !value.hour ||
      !value.dni
    ) {
      context.response.status = 406;
      return;
    }

    if (!value.id_doctor) {
      context.response.body = {
        message: "id_doctor is required",
      };
      context.response.status = 406;
      return;
    }

    const { year, month, day, hour, dni, id_doctor } = value;

    const slotEncontrado = await SlotsCollection.findOne({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      available: true,
      id_doctor: id_doctor,
    });

    if (!slotEncontrado) {
      context.response.status = 404;
      return;
    }

    await SlotsCollection.updateOne(
      { _id: slotEncontrado.id },
      { $set: { available: false, dni, id_doctor } }
    );

    const { id, ...rest } = slotEncontrado;

    context.response.body = {
      ...rest,
      available: false,
      dni,
      id_doctor,
    };
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
