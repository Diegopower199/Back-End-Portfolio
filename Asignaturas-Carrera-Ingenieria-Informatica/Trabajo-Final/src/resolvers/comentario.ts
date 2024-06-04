import { ComentarioSchema } from "../db/schema.ts";

export const Comentario = {
  _id: (parent: ComentarioSchema): string => {
    return parent._id.toString();
  },
};
