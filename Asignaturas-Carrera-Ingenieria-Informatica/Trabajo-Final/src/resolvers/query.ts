import { ObjectId } from "mongo";
import {
  ComentariosCollection,
  PostsCollection,
  UsuariosCollection,
} from "../db/dbconnection.ts";
import { ComentarioSchema, PostSchema, UsuarioSchema } from "../db/schema.ts";
import { verifyJWT } from "../lib/jwt.ts";
import { Usuario } from "../types.ts";

export const Query = {
  leerPost: async (
    _: unknown,
    args: { idPost: string; title: string }
  ): Promise<PostSchema> => {
    try {
      const { idPost, title } = args;

      const postEncontrado: PostSchema | undefined =
        await PostsCollection.findOne({
          _id: new ObjectId(idPost),
          title: title,
        });

      if (!postEncontrado) {
        throw new Error("Ese post no existe por esa persona");
      }

      return {
        _id: postEncontrado._id,
        contenido: postEncontrado.contenido,
        fechaPost: postEncontrado.fechaPost,
        title: postEncontrado.title,
        comentarios: postEncontrado.comentarios.map((comentario) => {
          return new ObjectId(comentario);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  leerComentario: async (
    _: unknown,
    args: { idComentario: string; contenido: string }
  ): Promise<ComentarioSchema> => {
    try {
      const { idComentario, contenido } = args;

      const usuarioEncontrado: UsuarioSchema | undefined =
        await UsuariosCollection.findOne({
          _id: new ObjectId(idComentario),
        });

      if (!usuarioEncontrado) {
        throw new Error("NO existe el id de comentario con esa id");
      }

      const comentarioEncontrado: ComentarioSchema | undefined =
        await ComentariosCollection.findOne({
          idUsuario: new ObjectId(idComentario),
          contenido: contenido,
        });

      if (!comentarioEncontrado) {
        throw new Error("Ese comentario no existe por esa persona");
      }

      return {
        _id: comentarioEncontrado._id,
        contenido: comentarioEncontrado.contenido,
        fechaCreacion: comentarioEncontrado.fechaCreacion,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  leerPosts: async (_: unknown, _args: {}): Promise<PostSchema[]> => {
    try {
      const posts: PostSchema[] = await PostsCollection.find({}).toArray();

      return posts.map((post: PostSchema) => ({
        _id: post._id,
        contenido: post.contenido,
        fechaPost: post.fechaPost,
        title: post.title,
        comentarios: post.comentarios.map((comentario) => {
          return new ObjectId(comentario);
        }),
      }));
    } catch (error) {
      throw new Error(error);
    }
  },

  leerComentarios: async (
    _: unknown,
    _args: {}
  ): Promise<ComentarioSchema[]> => {
    try {
      const comentarios: ComentarioSchema[] = await ComentariosCollection.find(
        {}
      ).toArray();

      return comentarios.map((comentario: ComentarioSchema) => {
        return {
          _id: comentario._id,
          contenido: comentario.contenido,
          fechaCreacion: comentario.fechaCreacion,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  verToken: async (_: unknown, args: { token: string }): Promise<Usuario> => {
    try {
      const user: Usuario = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};
