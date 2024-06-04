import * as bcrypt from "bcrypt";
import { ObjectId } from "mongo";
import {
  MatchCollection,
  PlayerCollection,
  TeamCollection,
  UsersCollection,
} from "../db/database.ts";
import {
  MatchSchema,
  PlayerSchema,
  TeamSchema,
  UserSchema,
} from "../db/schema.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { MatchStatus, User } from "../types.ts";

export const Mutation = {
  register: async (
    _: unknown,
    args: { username: string; email: string; password: string }
  ): Promise<UserSchema & { token: string }> => {
    try {
      const userEncontrado: UserSchema = await UsersCollection.findOne({
        email: args.email,
      });

      if (userEncontrado) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.password);
      const _id = new ObjectId();
      const token = await createJWT(
        {
          id: _id.toString(),
          username: args.username,
          email: args.email,
        },
        Deno.env.get("JWT_SECRET")!
      );

      const newUser = await UsersCollection.insertOne({
        _id,
        username: args.username,
        email: args.email,
        password: hashedPassword,
      });

      return {
        ...newUser,
        token,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  logIn: async (
    _: unknown,
    args: { email: string; password: string }
  ): Promise<string> => {
    try {
      const userEncontrado: UserSchema = await UsersCollection.findOne({
        email: args.email,
      });

      if (!userEncontrado) {
        throw new Error("User does not exist");
      }

      const validPassword = await bcrypt.compare(
        args.password,
        userEncontrado.password
      );

      if (!validPassword) {
        throw new Error("Invalid password");
      }

      const token = await createJWT(
        {
          id: userEncontrado._id.toString(),
          username: userEncontrado.username,
          email: userEncontrado.email,
        },
        Deno.env.get("JWT_SECRET")!
      );

      return token;
    } catch (error) {
      throw new Error(error);
    }
  },

  createTeam: async (
    _: unknown,
    args: {
      name: string;
      players: string[];
      classified: boolean;
      token: string;
    }
  ): Promise<TeamSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to create a team");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to create a team");
      }

      const { name, players, classified } = args;

      const teamEncontrado = await TeamCollection.findOne({
        name,
      });

      if (teamEncontrado) {
        throw new Error("Team already exists");
      }

      const _id = await TeamCollection.insertOne({
        name,
        classified,
        players: players.map((player) => {
          return new ObjectId(player);
        }),
        updatedBY: new ObjectId(user.id),
      });

      return {
        _id,
        name,
        classified,
        players: players.map((player) => {
          return new ObjectId(player);
        }),
        updatedBy: new ObjectId(user.id),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  updateTeam: async (
    _: unknown,
    args: {
      id: string;
      players?: string[];
      classified?: boolean;
      token: string;
    }
  ): Promise<TeamSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to update a team");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to update a team");
      }

      const { id, players, classified } = args;
      const _id = new ObjectId(id);
      let set = {};

      if (players) {
        set = {
          ...set,
          players: players?.map((player) => {
            return new ObjectId(player);
          }),
        };
      }

      if (classified) {
        set = { ...set, classified };
      }

      const team = await TeamCollection.updateOne(
        { _id },
        {
          $set: set,
          $push: { updatedBy: new ObjectId(user.id) },
        }
      );

      if (team.matchedCount === 0) {
        throw new Error("Team not found");
      }

      return (await TeamCollection.findOne({
        _id,
      })) as TeamSchema;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteTeam: async (
    _: unknown,
    args: { id: string; token: string }
  ): Promise<TeamSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to delete a team");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to delete a team");
      }

      const { id } = args;
      const _id = new ObjectId(id);

      const team = await TeamCollection.findOne({
        _id,
      });

      if (!team) {
        throw new Error("Team not found");
      }

      await TeamCollection.deleteOne({ _id });

      return {
        ...team,
        user,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  createMatch: async (
    _: unknown,
    args: {
      team1: string;
      team2: string;
      goals_team1: number;
      goals_team2: number;
      date: Date;
      status: MatchStatus;
      token: string;
    }
  ): Promise<MatchSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to create a match");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to create a match");
      }

      const { team1, team2, goals_team1, goals_team2, date, status } = args;

      const matchEncontrado = await MatchCollection.findOne({
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        date,
      });

      if (matchEncontrado) {
        throw new Error("Match already exists");
      }

      const _id = await MatchCollection.insertOne({
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        goals_team1,
        goals_team2,
        date,
        status,
        updatedBy: new ObjectId(user.id),
      });

      return {
        _id,
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        goals_team1,
        goals_team2,
        date,
        status,
        updatedBy: new ObjectId(user.id),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  updateMatch: async (
    _: unknown,
    args: {
      id: string;
      goals_team1: number;
      goals_team2: number;
      status: MatchStatus;
      token: string;
    }
  ): Promise<MatchSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to update a match");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to update a match");
      }

      const { id, goals_team1, goals_team2, status } = args;
      const _id = new ObjectId(id);

      const match = await MatchCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            goals_team1,
            goals_team2,
            status,
          },
          $push: { updatedBy: new Object(user.id) },
        }
      );

      if (match.matchedCount === 0) {
        throw new Error("Match not found");
      }

      return (await MatchCollection.findOne({
        _id,
      })) as MatchSchema;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteMatch: async (
    _: unknown,
    args: { id: string; token: string }
  ): Promise<MatchSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to delete a match");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to delete a match");
      }

      const { id } = args;
      const _id = new ObjectId(id);

      const match = await MatchCollection.findOne({
        _id,
      });

      if (!match) {
        throw new Error("Match not found");
      }

      await MatchCollection.deleteOne({ _id });

      return {
        ...match,
        user,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  createPlayer: async (
    _: unknown,
    args: { name: string; token: string }
  ): Promise<PlayerSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to create a player");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to create a player");
      }

      const { name } = args;

      const _id = await PlayerCollection.insertOne({
        name,
        updatedBy: new ObjectId(user.id),
      });

      return {
        _id,
        name,
        updatedBy: user.id,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deletePlayer: async (
    _: unknown,
    args: { id: string; token: string }
  ): Promise<PlayerSchema> => {
    try {
      if (!args.token) {
        throw new Error("You must introduce token to delete a player");
      }

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;

      if (!user) {
        throw new Error("You must be logged in to delete a player");
      }

      const { id } = args;
      const _id = new ObjectId(id);

      const player = await PlayerCollection.findOne({
        _id,
      });

      if (!player) {
        throw new Error("Player not found");
      }

      await PlayerCollection.deleteOne({
        _id,
      });

      return {
        ...player,
        user,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
