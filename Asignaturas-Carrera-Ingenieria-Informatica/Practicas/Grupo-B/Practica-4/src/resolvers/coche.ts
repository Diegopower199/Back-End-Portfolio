import { CocheSchema } from "../db/schema.ts";

export const Coche = {
  id: (parent: CocheSchema): string => {
    return parent._id.toString();
  },
};
