import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { Server } from "std/http/server.ts";
import { Match } from "./resolvers/match.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Player } from "./resolvers/player.ts";
import { Query } from "./resolvers/query.ts";
import { Team } from "./resolvers/team.ts";
import { typeDefs } from "./schema.ts";

const resolvers = {
  Query,
  Mutation,
  Match,
  Player,
  Team,
};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 8000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:8000/graphql`);
