import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { Users, arrayUsuarios } from "../types.ts";

type DeleteUserContext = RouterContext<
  "/deleteUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = (context: DeleteUserContext) => {
  try {
    const userEncontrado: Users | undefined = arrayUsuarios.find((usuario) => {
      return usuario.ID === Number(context.params.id);
    });

    if (!context.params?.id && !userEncontrado) {
      context.response.body = {
        message: "Usuario no encontrado",
      };
      context.response.status = 404;
      return;
    }

    arrayUsuarios.splice(
      arrayUsuarios.findIndex(
        (usuario) => usuario.ID === Number(context.params.id)
      ),
      1
    );

    context.response.body = "Usuario eliminado";
    context.response.status = 200;
    return;
  } catch (error) {
    context.response.status = 500;
    context.response.body = error;
  }
};
