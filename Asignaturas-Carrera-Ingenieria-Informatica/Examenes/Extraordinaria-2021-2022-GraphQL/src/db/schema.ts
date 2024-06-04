import { ObjectId } from "mongo";
import { Author, Book, PressHouse } from "../types.ts";

export type PressHouseSchema = Omit<PressHouse, "id" | "books"> & {
  _id: ObjectId;
  books: ObjectId[];
};

export type AuthorSchema = Omit<Author, "id" | "books"> & {
  _id: ObjectId;
  books: ObjectId[];
};

export type BookSchema = Omit<Book, "id" | "author" | "pressHouse"> & {
  _id: ObjectId;
  author: ObjectId;
  pressHouse: ObjectId;
};
