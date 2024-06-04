import { Application, Router } from "oak";
import { deleteUser } from "./resolvers/delete.ts";
import { getBooks, getUser } from "./resolvers/get.ts";
import { postAuthors, postBooks, postUsers } from "./resolvers/post.ts";
import { updateCart } from "./resolvers/put.ts";

const router = new Router();

router
  .post("/addUser", postUsers)
  .post("/addAuthor", postAuthors)
  .post("/addBook/:id", postBooks)
  .put("/updateCart/:id_user/:id_book", updateCart)
  .get("/getBooks", getBooks)
  .get("/getUser/:id", getUser)
  .delete("/deleteUser", deleteUser);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
