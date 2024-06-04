import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { config } from "std/dotenv/mod.ts";
import { Server } from "std/http/server.ts";
import { Mensaje } from "./resolvers/mensaje.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Query } from "./resolvers/query.ts";
import { Usuario } from "./resolvers/usuario.ts";
import { typeDefs } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const resolvers = {
  Query,
  Mutation,
  Usuario,
  Mensaje,
};

const port = Number(Deno.env.get("PORT"));

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
          context: (req) => {
            const lang = req.headers.get("lang");
            const token = req.headers.get("token");

            return {
              token: token,
              lang: lang,
            };
          },
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: port,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:${port}/graphql`);
