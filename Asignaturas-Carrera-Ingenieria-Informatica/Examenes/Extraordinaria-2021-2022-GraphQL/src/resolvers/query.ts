import { ObjectId } from "mongo";
import {
  AuthorsCollection,
  BooksCollection,
  PressHouseCollection,
} from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

export const Query = {
  books: async (_: unknown, args: {}): Promise<BookSchema[]> => {
    try {
      const books: BookSchema[] = await BooksCollection.find({}).toArray();

      return books.map((libro: BookSchema) => {
        return {
          _id: libro._id,
          title: libro.title,
          author: libro.author,
          pressHouse: libro.pressHouse,
          year: libro.year,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  authors: async (_: unknown, args: {}): Promise<AuthorSchema[]> => {
    try {
      const authors: AuthorSchema[] = await AuthorsCollection.find(
        {}
      ).toArray();

      return authors.map((author: AuthorSchema) => {
        return {
          _id: author._id,
          name: author.name,
          lang: author.lang,
          books: author.books,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  presshouses: async (_: unknown, args: {}): Promise<PressHouseSchema[]> => {
    try {
      const pressHouses: PressHouseSchema[] = await PressHouseCollection.find(
        {}
      ).toArray();

      return pressHouses.map((pressHouse: PressHouseSchema) => {
        return {
          _id: pressHouse._id,
          name: pressHouse.name,
          web: pressHouse.web,
          country: pressHouse.country,
          books: pressHouse.books,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  book: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const bookEncontrado: BookSchema | undefined =
        await BooksCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!bookEncontrado) {
        throw new Error("Error, ese libro no existe");
      }

      return {
        _id: bookEncontrado._id,
        title: bookEncontrado.title,
        author: bookEncontrado.author,
        pressHouse: bookEncontrado.pressHouse,
        year: bookEncontrado.year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  author: async (_: unknown, args: { id: string }): Promise<AuthorSchema> => {
    try {
      const authorEncontrado: AuthorSchema | undefined =
        await AuthorsCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!authorEncontrado) {
        throw new Error("Error, ese author no existe");
      }

      return {
        _id: authorEncontrado._id,
        name: authorEncontrado.name,
        lang: authorEncontrado.lang,
        books: authorEncontrado.books,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  presshouse: async (
    _: unknown,
    args: { id: string }
  ): Promise<PressHouseSchema> => {
    try {
      const pressHouseEncontrado: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!pressHouseEncontrado) {
        throw new Error("Error, ese press house no existe");
      }

      return {
        _id: pressHouseEncontrado._id,
        name: pressHouseEncontrado.name,
        web: pressHouseEncontrado.web,
        country: pressHouseEncontrado.country,
        books: pressHouseEncontrado.books,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
