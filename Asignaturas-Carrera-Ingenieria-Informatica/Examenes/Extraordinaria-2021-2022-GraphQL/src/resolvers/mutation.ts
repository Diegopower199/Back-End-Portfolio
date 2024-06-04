import { ObjectId } from "mongo";
import {
  AuthorsCollection,
  BooksCollection,
  PressHouseCollection,
} from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

export const Mutation = {
  addPressHouse: async (
    _: unknown,
    args: { name: string; web: string; country: string; books: string[] }
  ): Promise<PressHouseSchema> => {
    try {
      const pressHouseEncontrado = await PressHouseCollection.findOne({
        name: args.name,
      });

      if (pressHouseEncontrado) {
        throw new Error("Ya existe el press house");
      }

      const pressHouse: ObjectId = await PressHouseCollection.insertOne({
        name: args.name,
        web: args.web,
        country: args.country,
        books: args.books.map((book) => {
          return new ObjectId(book);
        }),
      });

      return {
        _id: pressHouse,
        name: args.name,
        web: args.web,
        country: args.country,
        books: args.books.map((book) => {
          return new ObjectId(book);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  addAuthor: async (
    _: unknown,
    args: { name: string; lang: string; books: string[] }
  ): Promise<AuthorSchema> => {
    try {
      const authorEncontrado = await AuthorsCollection.findOne({
        name: args.name,
      });

      if (authorEncontrado) {
        throw new Error("Ya existe el author");
      }

      const author: ObjectId = await AuthorsCollection.insertOne({
        name: args.name,
        lang: args.lang,
        books: args.books.map((book) => {
          return new ObjectId(book);
        }),
      });

      return {
        _id: author,
        name: args.name,
        lang: args.lang,
        books: args.books.map((book) => {
          return new ObjectId(book);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  addBook: async (
    _: unknown,
    args: { title: string; author: string; pressHouse: string; year: number }
  ): Promise<BookSchema> => {
    try {
      const bookEncontrado = await BooksCollection.findOne({
        title: args.title,
      });

      if (bookEncontrado) {
        throw new Error("Ya existe el book");
      }

      const book: ObjectId = await BooksCollection.insertOne({
        title: args.title,
        author: new ObjectId(args.author),
        pressHouse: new ObjectId(args.pressHouse),
        year: args.year,
      });

      return {
        _id: book,
        title: args.title,
        author: new ObjectId(args.author),
        pressHouse: new ObjectId(args.pressHouse),
        year: args.year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deletePressHouse: async (
    _: unknown,
    args: { id: string }
  ): Promise<PressHouseSchema> => {
    try {
      const pressHouseEncontrado: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!pressHouseEncontrado) {
        throw new Error("Press house not found");
      }

      await PressHouseCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

      return {
        _id: pressHouseEncontrado._id,
        name: pressHouseEncontrado.name,
        web: pressHouseEncontrado.web,
        country: pressHouseEncontrado.country,
        books: pressHouseEncontrado.books.map((book) => {
          return new ObjectId(book);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteAuthor: async (
    _: unknown,
    args: { id: string }
  ): Promise<AuthorSchema> => {
    try {
      const authorEncontrado: AuthorSchema | undefined =
        await AuthorsCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!authorEncontrado) {
        throw new Error("Author not found");
      }

      await AuthorsCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

      return {
        _id: authorEncontrado._id,
        name: authorEncontrado.name,
        lang: authorEncontrado.lang,
        books: authorEncontrado.books.map((book) => {
          return new ObjectId(book);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const bookEncontrado: BookSchema | undefined =
        await BooksCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!bookEncontrado) {
        throw new Error("Author not found");
      }

      await BooksCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

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
};
