import { isEmail } from "https://deno.land/x/isemail/mod.ts";
import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import {
  AuthorCollection,
  BooksCollection,
  UserCollection,
} from "../db/mongo.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schemas.ts";
import { Author, Books, User } from "../types.ts";

type PostAddAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAuthors = async (context: PostAddAuthorContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.name) {
      context.response.status = 400;
      return;
    }

    const author: Partial<Author> = {
      name: value.name,
      books: [],
    };

    await AuthorCollection.insertOne(author as AuthorSchema);
    const { _id, ...authorWithoutId } = author as AuthorSchema;

    context.response.body = authorWithoutId;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};

type PostAddBooksContext = RouterContext<
  "/addBook/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBooks = async (context: PostAddBooksContext) => {
  try {
    if (context.params?.id) {
      const findAuthor: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          _id: new ObjectId(context.params.id),
        });

      if (!findAuthor) {
        context.response.body = {
          message: "User not found to add book",
        };
        context.response.status = 404;
        return;
      }

      const result = context.request.body({ type: "json" });
      const value = await result.value;

      if (!value?.title || !value?.author || !value?.pages) {
        context.response.status = 400;
        return;
      }

      const myUUID = crypto.randomUUID();

      const book: Partial<Books> = {
        title: value.title,
        author: value.author,
        pages: value.pages,
        ISBN: myUUID,
      };

      await BooksCollection.insertOne(book as BooksSchema);
      const { _id, ...booksWithoutId } = book as BooksSchema;

      findAuthor.books.push(_id);

      await AuthorCollection.updateOne(
        {
          _id: findAuthor._id,
        },
        {
          $set: {
            books: findAuthor.books,
          },
        }
      );

      context.response.body = booksWithoutId;
      context.response.status = 200;
    }
  } catch (error) {
    context.response.status = 500;
  }
};

type PostAddUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postUsers = async (context: PostAddUserContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );

    if (!emailRegex.test(value.email)) {
      context.response.status = 400;
      return;
    }

    const userEncontrado: UserSchema | undefined = await UserCollection.findOne(
      {
        email: value.email,
      }
    );

    if (userEncontrado) {
      context.response.body = {
        message: "El usuario ya existe",
      };
      context.response.status = 400;
      return;
    }

    if (!isEmail(value.email)) {
      context.response.body = {
        message: "Email incorrecto",
      };
      context.response.status = 400;
      return;
    }

    if (!value?.name || !value?.email || !value?.password) {
      context.response.body = {
        message: "Faltan datos",
      };
      context.response.status = 400;
      return;
    }

    const user: Partial<User> = {
      name: value.name,
      email: value.email,
      password: value.password,
      created_at: new Date(),
      cart: [],
    };

    await UserCollection.insertOne(user as UserSchema);
    const { _id, ...userWithoutId } = user as UserSchema;

    context.response.body = userWithoutId;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
