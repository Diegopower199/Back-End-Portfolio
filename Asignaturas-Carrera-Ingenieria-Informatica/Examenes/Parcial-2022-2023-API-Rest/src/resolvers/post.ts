import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/dbconnection.ts";
import { SlotsSchema } from "../db/schema.ts";
import { Slots } from "../types.ts";

type PostSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const addSlots = async (context: PostSlotContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.day || !value?.month || !value?.year || !value?.hour) {
      context.response.body = {
        msg: "Faltan datos",
      };
      context.response.status = 400;
      return;
    }

    if (value.day <= 1 || value.day >= 31) {
      context.response.body = {
        msg: "El día debe estar entre 1 y 31",
      };
      context.response.status = 406;
      return;
    }

    if (value.month < 1 || value.month > 12) {
      context.response.body = {
        msg: "El mes debe estar entre 1 y 12",
      };
      context.response.status = 406;
      return;
    }

    if (value.hour < 0 || value.hour > 24) {
      context.response.body = {
        msg: "La hora debe estar entre 0 y 24",
      };
      context.response.status = 406;
      return;
    }

    const slotEncontrado = await SlotsCollection.findOne({
      day: value.day,
      month: value.month,
      year: value.year,
      hour: value.hour,
    });

    if (!slotEncontrado?.available) {
      context.response.body = {
        msg: "El slot ya está ocupado",
      };
      context.response.status = 409;
      return;
    }

    const newSlot: Partial<Slots> = {
      day: value.day,
      month: value.month,
      year: value.year,
      hour: value.hour,
      available: true,
    };

    const id = await SlotsCollection.insertOne(newSlot as SlotsSchema);
    newSlot.id = id.toString();
    const { _id, ...slotSinId } = newSlot as SlotsSchema;

    context.response.body = slotSinId;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
