import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/dbconnection.ts";
import { SlotsSchema } from "../db/schema.ts";

type UpdateSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateSlot = async (context: UpdateSlotContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (
      !value?.day ||
      !value?.month ||
      !value?.year ||
      !value?.hour ||
      !value?.dni
    ) {
      context.response.body = {
        msg: "Faltan datos",
      };
      context.response.status = 400;
      return;
    }

    const slotEncontrado = await SlotsCollection.findOne({
      day: parseInt(value.day),
      month: parseInt(value.month),
      year: parseInt(value.year),
      hour: parseInt(value.hour),
      available: true,
    });

    if (!slotEncontrado) {
      context.response.body = {
        msg: "Slot no disponible",
      };
      context.response.status = 404;
      return;
    }

    const updateSlot = await SlotsCollection.updateOne(
      {
        day: parseInt(value.day),
        month: parseInt(value.month),
        year: parseInt(value.year),
        hour: parseInt(value.hour),
        available: true,
      },
      { $set: { available: false, dni: value.dni } }
    );
    const { _id, ...slotSinid } = updateSlot as SlotsSchema;

    context.response.body = slotSinid;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
