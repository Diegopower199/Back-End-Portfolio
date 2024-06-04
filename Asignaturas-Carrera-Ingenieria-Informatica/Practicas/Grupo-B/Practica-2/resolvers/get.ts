import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { arrayUsuarios, Users } from "../types.ts";

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = (context: GetUserContext) => {
  try {
    if (context.params?.id) {
      const usuario: Users | undefined = arrayUsuarios.find((usuario) => {
        return usuario.ID === Number(context.params.id);
      });

      if (!usuario) {
        context.response.body = {
          message: "Usuario no encontrado",
        };
        context.response.status = 404;
        return;
      }

      context.response.body = usuario;
      context.response.status = 200;
      return;
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = error;
  }
};
