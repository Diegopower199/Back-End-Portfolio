import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/dbconnection";

type GetAvailableSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getSlots = async (context: GetAvailableSlotsContext) => {
  try {
    const day = context.request.url.searchParams.get("day");
    const month = context.request.url.searchParams.get("month");
    const year = context.request.url.searchParams.get("year");

    if (!month || !year) {
      context.response.body = {
        msg: "Faltan datos",
      };
      context.response.status = 400;
      return;
    }

    if (day && month && year) {
      const slotsEncontrados = await SlotsCollection.find({
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
      }).toArray();

      context.response.body = slotsEncontrados;
      context.response.status = 200;
    } else if (month && year) {
      const slotsEncontrados = await SlotsCollection.find({
        month: parseInt(month),
        year: parseInt(year),
      }).toArray();

      context.response.body = slotsEncontrados;
      context.response.status = 200;
    } else {
      context.response.body = {
        msg: "Error al buscar los slots",
      };
      context.response.status = 403;
    }
  } catch (error) {
    context.response.status = 500;
  }
};
