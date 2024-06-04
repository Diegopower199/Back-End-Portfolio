import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";
import { Slot } from "../types.ts";

const isValidDate = (
  year: number,
  month: number,
  day: number,
  hour: number
): boolean => {
  const date = new Date(year, month, day, hour);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day &&
    date.getHours() === hour
  );
};

type PostAddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addSlot = async (context: PostAddSlotContext): Promise<void> => {
  try {
    const result = context.request.body({ type: "json" });
    const value: Slot = await result.value;

    if (!value?.day || !value?.month || !value?.year || !value?.hour) {
      context.response.status = 406;
      return;
    }

    if (!value?.id_doctor) {
      context.response.body = {
        message: "id_doctor is required",
      };
      context.response.status = 406;
      return;
    }

    const { day, month, year, hour, id_doctor } = value;

    if (!isValidDate(year, month - 1, day, hour)) {
      context.response.status = 406;
      return;
    }

    const slotEncontrado = await SlotsCollection.findOne({
      day,
      month,
      year,
      hour,
      id_doctor,
    });

    if (!slotEncontrado) {
      context.response.status = 404;
      return;
    }
    if (!slotEncontrado.available) {
      context.response.status = 409;
      return;
    }

    const slot: Partial<Slot> = {
      ...value,
      available: true,
    };

    await SlotsCollection.insertOne(slot as SlotSchema);
    const { id, ...slotWithoutId } = slot as SlotSchema;

    context.response.body = slotWithoutId;
    context.response.status = 200;
    return;
  } catch (error) {
    context.response.status = 500;
  }
};
