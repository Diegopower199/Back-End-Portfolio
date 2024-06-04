import { TeamCollection } from "../db/database.ts";
import { MatchSchema, TeamSchema } from "../db/schema.ts";

export const Match = {
  id: (parent: MatchSchema): string => {
    return parent._id.toString();
  },

  team1: async (parent: MatchSchema): Promise<TeamSchema> => {
    try {
      const teamEncontrado = await TeamCollection.findOne({
        _id: parent.team1,
      });

      if (!teamEncontrado) {
        throw new Error("Team not found");
      }

      return teamEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },

  team2: async (parent: MatchSchema): Promise<TeamSchema> => {
    try {
      const teamEncontrado = await TeamCollection.findOne({
        _id: parent.team2,
      });

      if (!teamEncontrado) {
        throw new Error("Team not found");
      }

      return teamEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },
};
