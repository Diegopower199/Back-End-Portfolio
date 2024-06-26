import { ObjectId } from "mongo";
import { Slot } from "../types.ts";

export type SlotSchema = Omit<Slot, "id"> & {
  _id: ObjectId;
};
