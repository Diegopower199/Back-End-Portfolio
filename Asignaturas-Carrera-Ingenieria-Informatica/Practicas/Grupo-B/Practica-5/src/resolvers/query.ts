import { MensajesCollection } from "../db/dbconnection.ts";
import { MensajeSchema } from "../db/schema.ts";

export const Query = {
  getMessages: async (
    _: unknown,
    args: { page: number; perPage: number }
  ): Promise<MensajeSchema[]> => {
    try {
      if (args.page <= 0) {
        throw new Error("Error, la pagina no puede ser negativa o igual a 0");
      }

      if (args.perPage < 10 || args.perPage > 200) {
        throw new Error("Error, el limite de pagina es de 10-200");
      }

      const mensajes: MensajeSchema[] | undefined =
        await MensajesCollection.find()
          .limit(args.perPage)
          .skip(args.perPage * (args.page - 1))
          .toArray();

      if (!mensajes) {
        throw new Error("Error, no existe mensajes");
      }

      return mensajes.map((mensaje: MensajeSchema) => {
        return {
          _id: mensaje._id,
          emisor: mensaje.emisor,
          receptor: mensaje.receptor,
          idioma: mensaje.idioma,
          fechaCreacionMensaje: mensaje.fechaCreacionMensaje,
          contenido: mensaje.contenido,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
