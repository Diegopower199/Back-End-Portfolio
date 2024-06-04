import { BooksCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema } from "../db/schema.ts";

export const Author = {
  id: (parent: AuthorSchema): string => {
    return parent._id.toString();
  },

  books: async (parent: AuthorSchema): Promise<BookSchema[]> => {
    try {
      return await BooksCollection.find({
        _id: { $in: parent.books },
      }).toArray();
    } catch (error) {
      throw new Error(error);
    }
  },
};
