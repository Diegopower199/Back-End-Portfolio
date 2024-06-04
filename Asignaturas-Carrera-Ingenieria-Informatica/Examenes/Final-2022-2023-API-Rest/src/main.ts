import { Application, Router } from "oak";
import { config } from "std/dotenv/mod.ts";
import { getCharacter, getCharacterByIds } from "./resolvers/get.ts";

await config({ export: true, allowEmptyValues: true });

const router = new Router();

router
  .get("/character/:id", getCharacter)
  .get("/charactersByIds/:ids", getCharacterByIds);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
