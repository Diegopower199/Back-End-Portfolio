import { ObjectId } from "mongo";

export type Books = {
  title: string;
  author: string;
  pages: number;
  ISBN: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  cart: ObjectId[];
};

export type Author = {
  name: string;
  books: ObjectId[];
};
