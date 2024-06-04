import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { config } from "std/dotenv/mod.ts";
import { Server } from "std/http/server.ts";
import { Author } from "./resolvers/Author.ts";
import { Book } from "./resolvers/Book.ts";
import { PressHouse } from "./resolvers/PressHouse.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Query } from "./resolvers/query.ts";
import { typeDefs } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const resolvers = {
  Query,
  Mutation,
  Author,
  Book,
  PressHouse,
};

const port = Number(Deno.env.get("PORT"));

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
  port: port,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:${port}/graphql`);
