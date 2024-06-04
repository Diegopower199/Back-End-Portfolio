import { MatchCollection, PlayerCollection } from "../db/database.ts";
import { MatchSchema, PlayerSchema, TeamSchema } from "../db/schema.ts";

export const Team = {
  id: (parent: TeamSchema): string => {
    return parent._id.toString();
  },

  matches: async (parent: TeamSchema): Promise<MatchSchema[]> => {
    try {
      const matchesEncontrados = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();

      return matchesEncontrados;
    } catch (error) {
      throw new Error(error);
    }
  },

  players: async (parent: TeamSchema): Promise<PlayerSchema[]> => {
    try {
      const playersEncontrados = await PlayerCollection.find({
        _id: { $in: parent.players },
      }).toArray();

      return playersEncontrados;
    } catch (error) {
      throw new Error(error);
    }
  },

  goals_for: async (parent: TeamSchema): Promise<number> => {
    try {
      const matchesEncontrados = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();

      const goals = matchesEncontrados.reduce((acc, match) => {
        if (match.team1.toString() === parent._id.toString()) {
          return acc + match.goals_team1;
        } else {
          return acc + match.goals_team2;
        }
      }, 0);

      return goals;
    } catch (error) {
      throw new Error(error);
    }
  },

  goals_against: async (parent: TeamSchema): Promise<number> => {
    try {
      const matchesEncontrados = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();

      const goals = matchesEncontrados.reduce((acc, match) => {
        if (match.team1.toString() === parent._id.toString()) {
          return acc + match.goals_team2;
        } else {
          return acc + match.goals_team1;
        }
      }, 0);

      return goals;
    } catch (error) {
      throw new Error(error);
    }
  },
};
