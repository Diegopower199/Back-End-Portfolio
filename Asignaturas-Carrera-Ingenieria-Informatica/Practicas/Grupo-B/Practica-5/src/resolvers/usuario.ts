import { UsuarioSchema } from "../db/schema.ts";

export const Usuario = {
  id: (parent: UsuarioSchema): string => {
    return parent._id.toString();
  },
};
