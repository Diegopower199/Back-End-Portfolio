import { ObjectId } from "mongo";
import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/mongo.ts";

type deleteUserContext = RouterContext<
  "/deleteUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: deleteUserContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params._id) {
      context.response.status = 406;
      return;
    }

    const { _id } = params;

    const user = await UserCollection.findOne({
      _id: new ObjectId(_id),
    });

    if (!user) {
      context.response.body = {
        message: "User not found",
      };
      context.response.status = 404;
      return;
    }

    await UserCollection.deleteOne({ _id: user._id });

    context.response.status = 200;
  } catch (error) {
    context.response.status = 500;
  }
};
