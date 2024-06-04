import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { removeEvent } from "./resolvers/delete.ts";
import { getEvent, getEvents } from "./resolvers/get.ts";
import { postEvento } from "./resolvers/post.ts";
import { updateEvent } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addEvent", postEvento)
  .get("/events", getEvents)
  .get("/event/:id", getEvent)
  .delete("/deleteEvent/:id", removeEvent)
  .put("/updateEvent", updateEvent);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
