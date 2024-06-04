import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { BooksCollection, UserCollection } from "../db/mongo.ts";
import { BooksSchema, UserSchema } from "../db/schemas.ts";

type UpdateCartContext = RouterContext<
  "/updateCart/:id_user/:id_book",
  {
    id_user: string;
    id_book: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateCart = async (context: UpdateCartContext) => {
  try {
    if (context.params?.id_user && context.params?.id_book) {
      const userEncontrado: UserSchema | undefined =
        await UserCollection.findOne({
          _id: new ObjectId(context.params.id_user),
        });

      const bookEncontrado: BooksSchema | undefined =
        await BooksCollection.findOne({
          _id: new ObjectId(context.params.id_book),
        });

      if (!userEncontrado || !bookEncontrado) {
        context.response.body = {
          message: "User or book not found",
        };
        context.response.status = 404;
        return;
      }

      userEncontrado.cart.push(bookEncontrado._id);
      await UserCollection.updateOne(
        {
          _id: userEncontrado._id,
        },
        {
          $set: {
            cart: userEncontrado.cart,
          },
        }
      );

      context.response.status = 200;
      return;
    }
  } catch (error) {
    context.response.status = 500;
  }
};
