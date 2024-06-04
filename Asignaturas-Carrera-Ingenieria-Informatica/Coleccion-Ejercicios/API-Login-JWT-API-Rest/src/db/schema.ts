import { ObjectId } from "mongo";
import { User } from "../types.ts";

export type UserSchema = Omit<User, "id" | "token"> & {
  _id: ObjectId;
};

export type BookSchema = Omit<User, "id"> & {
  _id: ObjectId;
};
