import { ComentariosCollection } from "../db/dbconnection.ts";
import { ComentarioSchema, PostSchema } from "../db/schema.ts";

export const Post = {
  _id: (parent: PostSchema): string => {
    return parent._id.toString();
  },
  
  comentarios: async (parent: PostSchema): Promise<ComentarioSchema[]> => {
    try {
      return await ComentariosCollection.find({
        _id: {
          $in: parent.comentarios,
        },
      }).toArray();
    } catch (error) {
      throw new Error(error);
    }
  },
};
