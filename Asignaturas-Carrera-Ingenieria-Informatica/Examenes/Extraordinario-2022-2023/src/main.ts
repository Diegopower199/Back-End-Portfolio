import { Application, Router } from "oak";
import { config } from "std/dotenv/mod.ts";
import { deleteEventConID } from "./resolvers/delete.ts";
import { getEventPorId, getEvents } from "./resolvers/get.ts";
import { postEvent } from "./resolvers/post.ts";
import { putUpdateEvent } from "./resolvers/put.ts";

await config({ export: true, allowEmptyValues: true });

const port = Number(Deno.env.get("PORT"));

const router = new Router();

router
  .post("/addEvent", postEvent)
  .get("/events", getEvents)
  .get("/event/:id", getEventPorId)
  .delete("/deleteEvent/:id", deleteEventConID)
  .put("/updateEvent", putUpdateEvent);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: port });
