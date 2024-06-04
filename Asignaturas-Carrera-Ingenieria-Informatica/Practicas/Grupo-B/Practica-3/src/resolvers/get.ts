import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "mongo";
import { BooksCollection, UserCollection } from "../db/mongo.ts";
import { BooksSchema, UserSchema } from "../db/schemas.ts";

type GetBooksContext = RouterContext<
  "/getBooks",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    const limit = 10;
    const total = await BooksCollection.count();
    const pages = Math.ceil(total / limit);
    const page = params.page ? parseInt(params.page) : 1;

    if (params.page && params.title) {
      const books: BooksSchema[] = await BooksCollection.find({
        title: params.title,
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray();

      context.response.body = {
        books,
        page,
      };
      context.response.status = 200;
      return;
    } else {
      const books: BooksSchema[] = await BooksCollection.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray();

      context.response.body = {
        books,
        page,
        pages,
        totalBooks: total,
      };
      context.response.status = 200;
      return;
    }
  } catch (error) {
    context.response.status = 500;
  }
};

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = async (context: GetUserContext) => {
  try {
    if (context.params?.id) {
      const user: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(context.params.id),
      });

      if (!user) {
        context.response.body = {
          message: "User not found",
        };
        context.response.status = 404;
        return;
      }

      const { _id, ...userWithoutId } = user as UserSchema;

      context.response.body = {
        userWithoutId,
        id: _id.toString(),
      };
      context.response.status = 200;
    }
  } catch (error) {
    context.response.status = 500;
  }
};
