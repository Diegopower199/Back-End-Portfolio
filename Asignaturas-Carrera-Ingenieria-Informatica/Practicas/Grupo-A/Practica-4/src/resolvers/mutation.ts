import { SlotsCollection } from "../db/dbconnection.ts";
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

export const Mutation = {
  addSlots: async (
    _: unknown,
    args: { day: number; month: number; year: number; hour: number }
  ): Promise<Slot> => {
    try {
      if (!isValidDate(args.year, args.month, args.day, args.hour)) {
        throw new Error("Datos de día, mes año y hora incorrectos");
      }

      const slotEncontrado = await SlotsCollection.findOne({
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
      });

      if (slotEncontrado) {
        throw new Error("Slot already exists");
      }

      await SlotsCollection.insertOne({
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
        available: false,
      });

      return {
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
        available: false,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  removeSlots: async (
    _: unknown,
    args: { day: number; month: number; year: number; hour: number }
  ): Promise<Slot> => {
    try {
      if (!isValidDate(args.year, args.month, args.day, args.hour)) {
        throw new Error("Datos de día, mes año y hora incorrectos");
      }

      const slotEncontrado = await SlotsCollection.findOne({
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
      });

      if (!slotEncontrado) {
        throw new Error("Slot not exists");
      }

      if (slotEncontrado && slotEncontrado.available) {
        await SlotsCollection.deleteOne({
          day: args.day,
          month: args.month,
          year: args.year,
          hour: args.hour,
        });

        return { ...slotEncontrado };
      }

      return { ...slotEncontrado };
    } catch (error) {
      throw new Error(error);
    }
  },

  bookSlot: async (
    _: unknown,
    args: {
      day: number;
      month: number;
      year: number;
      hour: number;
      dni: string;
    }
  ): Promise<Slot> => {
    try {
      if (!isValidDate(args.year, args.month, args.day, args.hour)) {
        throw new Error("Datos de día, mes año y hora incorrectos");
      }

      const slotEncontrado = await SlotsCollection.findOne({
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
      });

      if (!slotEncontrado) {
        throw new Error("Slot not exists");
      }

      if (slotEncontrado && !slotEncontrado.available) {
        throw new Error("Slot is not available");
      }

      await SlotsCollection.updateOne(
        { day: args.day, month: args.month, year: args.year, hour: args.hour },
        { $set: { available: false } }
      );

      return {
        day: args.day,
        month: args.month,
        year: args.year,
        hour: args.hour,
        available: false,
        dni: args.dni,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
