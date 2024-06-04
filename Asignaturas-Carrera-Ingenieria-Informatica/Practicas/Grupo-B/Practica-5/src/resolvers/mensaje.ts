import { MensajeSchema } from "../db/schema.ts";

export const Mensaje = {
  id: (parent: MensajeSchema): string => {
    return parent._id.toString();
  },
};
