import { TeamCollection } from "../db/database.ts";
import { PlayerSchema, TeamSchema } from "../db/schema.ts";

export const Player = {
  id: (parent: PlayerSchema): string => {
    return parent._id.toString();
  },

  team: async (parent: PlayerSchema): Promise<TeamSchema | undefined> => {
    try {
      const teamEncontrado = await TeamCollection.findOne({
        players: parent._id,
      });

      return teamEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },
};
