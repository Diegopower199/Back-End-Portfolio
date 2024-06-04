import { ObjectId } from "mongo";
import {
  MatchCollection,
  PlayerCollection,
  TeamCollection,
} from "../db/database.ts";
import { MatchSchema, PlayerSchema, TeamSchema } from "../db/schema.ts";
import { verifyJWT } from "../lib/jwt.ts";
import { MatchStatus, User } from "../types.ts";

export const Query = {
  Me: async (_: unknown, args: { token: string }) => {
    try {
      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  teams: async (
    _: unknown,
    args: { classified?: boolean }
  ): Promise<TeamSchema[]> => {
    try {
      if (args.classified !== undefined) {
        return await TeamCollection.find({}).toArray();
      }

      const teamsEncontrados = await TeamCollection.find({
        classified: args.classified,
      }).toArray();

      return teamsEncontrados;
    } catch (error) {
      throw new Error(error);
    }
  },

  team: async (_: unknown, args: { id: string }): Promise<TeamSchema> => {
    try {
      const teamEncontrado = await TeamCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!teamEncontrado) {
        throw new Error("Team not found");
      }

      return teamEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },

  players: async (
    _: unknown,
    args: { team_id?: string }
  ): Promise<PlayerSchema[]> => {
    try {
      if (args.team_id) {
        const teamEncontrado = await TeamCollection.findOne({
          _id: new ObjectId(args.team_id),
        });

        if (!teamEncontrado) {
          throw new Error("Team not found");
        }

        return await PlayerCollection.find({
          _id: { $in: teamEncontrado.players },
        }).toArray();
      }

      const players = await PlayerCollection.find({}).toArray();

      return players;
    } catch (error) {
      throw new Error(error);
    }
  },

  player: async (_: unknown, args: { id: string }): Promise<PlayerSchema> => {
    try {
      const playerEncontrado = await PlayerCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!playerEncontrado) {
        throw new Error("Player not found");
      }

      return playerEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },

  matches: async (
    _: unknown,
    args: { status?: MatchStatus; team?: string; date?: Date }
  ): Promise<MatchSchema[]> => {
    try {
      let filter = {};

      if (args.status) {
        filter = { status: args.status };
      }

      if (args.team) {
        filter = {
          ...filter,
          $or: [
            { team1: new ObjectId(args.team) },
            { team2: new ObjectId(args.team) },
          ],
        };
      }

      if (args.date) {
        filter = { ...filter, date: args.date };
      }

      const matchesEncontrados = await MatchCollection.find(filter).toArray();

      return matchesEncontrados;
    } catch (error) {
      throw new Error(error);
    }
  },

  match: async (_: unknown, args: { id: string }): Promise<MatchSchema> => {
    try {
      const matchEncontrado = await MatchCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!matchEncontrado) {
        throw new Error("Match not found");
      }

      return matchEncontrado;
    } catch (error) {
      throw new Error(error);
    }
  },
};
