import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/mongo.ts";

type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const availableSlots = async (context: GetAvailabeSlotsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params.year || !params.month) {
      context.response.status = 403;
      return;
    }

    const { year, month, day, id_doctor } = params;

    if (!day) {
      const slotsEncontrados = await SlotsCollection.find({
        year: parseInt(year),
        month: parseInt(month),
        available: true,
      }).toArray();

      context.response.body = slotsEncontrados.map((slot) => {
        const { id, ...rest } = slot;
        return rest;
      });
      context.response.status = 200;
    } else {
      const slotsEncontrados = await SlotsCollection.find({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        available: true,
      }).toArray();

      context.response.body = slotsEncontrados.map((slot) => {
        const { id, ...rest } = slot;
        return rest;
      });
      context.response.status = 200;
    }

    if (!id_doctor) {
      const slotsEncontrados = await SlotsCollection.find({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        availableSlots: true,
      }).toArray();

      context.response.body = slotsEncontrados.map((slot) => {
        const { id, ...rest } = slot;
        return rest;
      });
      context.response.status = 200;
    } else {
      const slotsEncontrados = await SlotsCollection.find({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        availableSlots: true,
        id_doctor: id_doctor,
      }).toArray();

      context.response.body = slotsEncontrados.map((slot) => {
        const { id, ...rest } = slot;
        return rest;
      });
      context.response.status = 200;
    }
  } catch (error) {
    context.response.status = 500;
  }
};

type GetAvailabeSlotsDoctorContext = RouterContext<
  "/doctorApppointments/:id_doctor",
  {
    id_doctor: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const availableSlotsDoctor = async (
  context: GetAvailabeSlotsDoctorContext
) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params.id_doctor) {
      context.response.body = {
        message: "No id_doctor provided",
      };
      context.response.status = 406;
      return;
    }

    const { id_doctor } = params;
    const date = new Date();

    const slotsEncontrados = await SlotsCollection.find({
      id_doctor: id_doctor,
      available: false,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDay(),
      hour: date.getHours(),
    }).toArray();

    context.response.body = slotsEncontrados.map((slot) => {
      const { id, ...rest } = slot;
      return rest;
    });
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};

type GetAvailabeSlotsDniContext = RouterContext<
  "/patientAppointments/:dni",
  {
    dni: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const availableSlotsDNI = async (
  context: GetAvailabeSlotsDniContext
) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params.dni) {
      context.response.body = {
        message: "No dni provided",
      };
      context.response.status = 406;
      return;
    }

    const { dni } = params;
    const date = new Date();

    const slotsEncontrados = await SlotsCollection.find({
      dni: dni,
      available: true,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDay(),
      hour: date.getHours(),
    }).toArray();

    context.response.body = slotsEncontrados.map((slot) => {
      const { id, ...rest } = slot;
      return rest;
    });
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
