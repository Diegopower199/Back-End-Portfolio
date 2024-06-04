import { AuthorsCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

export const Book = {
  id: (parent: BookSchema): string => {
    return parent._id.toString();
  },

  author: async (parent: BookSchema): Promise<AuthorSchema | undefined> => {
    try {
      const authorEncontrado = await AuthorsCollection.findOne({
        books: parent._id,
      });

      return authorEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },

  pressHouse: async (
    parent: BookSchema
  ): Promise<PressHouseSchema | undefined> => {
    try {
      const pressHouseEncontrado = await PressHouseCollection.findOne({
        books: parent._id,
      });

      return pressHouseEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },
};
