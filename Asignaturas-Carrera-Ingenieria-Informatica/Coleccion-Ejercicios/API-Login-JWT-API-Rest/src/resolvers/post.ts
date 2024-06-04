import * as bcrypt from "bcrypt";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { Header } from "jwt";
import { BooksCollection, UsersCollection } from "../db/database.ts";
import { BookSchema, UserSchema } from "../db/schema.ts";
import { generateKey, verifyJWT } from "../lib/jwt.ts";
import { Book, User } from "../types.ts";

const header: Header = {
  alg: "HS256",
};

type SignInUsersContext = RouterContext<
  "/SignIn",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const SignIn = async (context: SignInUsersContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.username || !value?.email || !value?.password) {
      context.response.body = {
        message: "Faltan campos",
      };
      context.response.status = 404;
      return;
    }

    const userEncontrado = await UsersCollection.findOne({
      email: value.email,
    });

    if (userEncontrado) {
      context.response.body = {
        message: "Usuarios con ese email existe",
      };
      context.response.status = 400;
      return;
    }

    const hashedPassword = await bcrypt.hash(value.password);

    const user: Partial<User> = {
      username: value.username,
      email: value.email,
      password: hashedPassword,
    };

    await UsersCollection.insertOne(user as UserSchema);
    const { _id, ...userWithOutId } = user as UserSchema;

    context.response.body = {
      username: userWithOutId.username,
      email: userWithOutId.email,
    };
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};

type LogInUsersContext = RouterContext<
  "/LogIn",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const LogIn = async (context: LogInUsersContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.email || !value?.password) {
      context.response.body = {
        message: "Faltan campos",
      };
      context.response.status = 404;
      return;
    }

    const userEncontrado = await UsersCollection.findOne({
      email: value.email,
    });

    if (!userEncontrado) {
      context.response.body = {
        message: "Usuario no existente",
      };
      context.response.status = 400;
      return;
    }

    const validPasword = await bcrypt.compare(
      value.password,
      userEncontrado.password
    );
    if (!validPasword) {
      context.response.body = {
        message: "Invalid password",
      };
      context.response.status = 400;
      return;
    }

    const key = Deno.env.get("JWT_SECRET");
    const cryptoKey: CryptoKey = await generateKey(key!);
    const token = await create(
      header,
      {
        id: userEncontrado._id.toString(),
        username: value.username,
        email: value.email,
      },
      cryptoKey!
    );

    context.response.body = {
      token,
    };
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};

type PostBookContext = RouterContext<
  "/Book",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBook = async (context: PostBookContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (!value?.name || !value?.author) {
      context.response.body = {
        message: "Faltan campos",
      };
      context.response.status = 404;
      return;
    }

    if (!value?.token) {
      context.response.body = {
        message: "Se requiere introducir token",
      };
      context.response.status = 404;
      return;
    }

    const user: User = (await verifyJWT(
      value.token,
      Deno.env.get("JWT_SECRET")!
    )) as User;

    if (!user) {
      context.response.body = {
        message: "Se requiere estar logeado",
      };
      context.response.status = 400;
      return;
    }

    const book: Partial<Book> = {
      name: value.name,
      author: value.author,
    };

    await BooksCollection.insertOne(book as BookSchema);
    const { _id, ...bookWithOutId } = book as BookSchema;

    context.response.body = bookWithOutId;
    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
