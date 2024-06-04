import { MatchSchema } from "../db/schema.ts";

export const Match = {
  id: (parent: MatchSchema): string => {
    return parent._id.toString();
  },
};
