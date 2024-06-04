import { SlotsCollection } from "../db/dbconnection.ts";
import { Slot } from "../types.ts";

export const Query = {
  getSlots: async (): Promise<Slot[]> => {
    try {
      const slotsEncontrados = await SlotsCollection.find().toArray();

      return slotsEncontrados.map((slot) => {
        return {
          ...slot,
          id: slot._id.toString(),
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  availableSlots: async (
    _: unknown,
    args: { day: number; month: number; year: number }
  ): Promise<Slot[]> => {
    try {
      if (args.day) {
        const slotsEncontrados = await SlotsCollection.find({
          day: args.day,
          month: args.month,
          year: args.year,
        }).toArray();

        return slotsEncontrados.map((slot) => {
          return {
            ...slot,
            id: slot._id.toString(),
          };
        });
      } else {
        const slotsEncontrados = await SlotsCollection.find({
          month: args.month,
          year: args.year,
        }).toArray();

        return slotsEncontrados.map((slot) => {
          return {
            ...slot,
            id: slot._id.toString(),
          };
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};
