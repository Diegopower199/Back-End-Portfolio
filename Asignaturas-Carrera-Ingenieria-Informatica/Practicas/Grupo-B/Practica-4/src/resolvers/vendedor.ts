import { CochesCollection } from "../db/dbconnection.ts";
import { CocheSchema, VendedorSchema } from "../db/schema.ts";

export const Vendedor = {
  id: (parent: VendedorSchema): string => {
    return parent._id.toString();
  },

  coches: async (parent: VendedorSchema): Promise<CocheSchema[]> => {
    try {
      return await CochesCollection.find({
        _id: { $in: parent.coches },
      }).toArray();
    } catch (error) {
      throw new Error(error);
    }
  },
};
