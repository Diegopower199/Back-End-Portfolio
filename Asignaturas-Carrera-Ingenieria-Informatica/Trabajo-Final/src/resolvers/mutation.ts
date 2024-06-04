import * as bcrypt from "bcrypt";
import { ObjectId } from "mongo";
import {
  ComentariosCollection,
  PostsCollection,
  UsuariosCollection,
} from "../db/dbconnection.ts";
import { ComentarioSchema, PostSchema, UsuarioSchema } from "../db/schema.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { Post, Usuario, tipoUsuario } from "../types.ts";

export const Mutation = {
  registrer: async (
    _: unknown,
    args: { username: string; password: string; tipoUsuario: tipoUsuario }
  ): Promise<UsuarioSchema & { token: string }> => {
    try {
      const { username, password, tipoUsuario } = args;

      const usuarioEncontrado: UsuarioSchema | undefined =
        await UsuariosCollection.findOne({
          username: username,
        });

      if (usuarioEncontrado) {
        throw new Error("User already exists");
      }

      const hashedPassword: string = await bcrypt.hash(password);
      const _id: ObjectId = new ObjectId();

      const token = await createJWT(
        {
          id: _id.toString(),
          username: username,
          fechaCreacion: new Date(),
          tipoUsuario: tipoUsuario,
          postCreados: [],
          inicioSesionCuenta: false,
        },
        Deno.env.get("JWT_SECRET")!
      );

      await UsuariosCollection.insertOne({
        _id: _id,
        username: username,
        password: hashedPassword,
        fechaCreacion: new Date(),
        tipoUsuario: tipoUsuario,
        postCreados: [],
        inicioSesionCuenta: false,
      });

      return {
        _id: _id,
        username: username,
        password: hashedPassword,
        fechaCreacion: new Date(),
        tipoUsuario: tipoUsuario,
        postCreados: [],
        inicioSesionCuenta: false,
        token: token,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  login: async (
    _: unknown,
    args: { username: string; password: string }
  ): Promise<string> => {
    try {
      const { username, password } = args;
      
      const userEncontrado: UsuarioSchema | undefined =
        await UsuariosCollection.findOne({
          username: username,
        });

      if (!userEncontrado) {
        throw new Error("User does not exist");
      }

      let validPassword: boolean;

      if (!userEncontrado.password) {
        throw new Error("Invalid password");
      }

      validPassword = await bcrypt.compare(password, userEncontrado.password);

      const token = await createJWT(
        {
          id: userEncontrado._id.toString(),
          username: userEncontrado.username,
          fechaCreacion: userEncontrado.fechaCreacion,
          postCreados: userEncontrado.postCreados.map((post) => {
            return post.toString();
          }),
          tipoUsuario: userEncontrado.tipoUsuario,
          inicioSesionCuenta: true,
        },
        Deno.env.get("JWT_SECRET")!
      );

      await UsuariosCollection.updateOne(
        { _id: userEncontrado._id },
        {
          $set: {
            inicioSesionCuenta: true,
          },
        }
      );

      return token;
    } catch (error) {
      throw new Error(error);
    }
  },

  logOut: async (_: unknown, args: { token: string }): Promise<string> => {
    try {
      const { token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            inicioSesionCuenta: false,
          },
        }
      );

      return `Se ha cerrado sesion de este usuario ${user.username}`;
    } catch (error) {
      throw new Error(error);
    }
  },

  signOut: async (_: unknown, args: { token: string }): Promise<string> => {
    try {
      const { token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      const usuarioEncontrado = await UsuariosCollection.findOne({
        _id: new ObjectId(user.id),
      });

      if (!usuarioEncontrado) {
        throw new Error("No existe el usuario");
      }

      const postsPromesas: Promise<PostSchema>[] =
        usuarioEncontrado?.postCreados.map(
          async (post: ObjectId): Promise<PostSchema> => {
            const postEncontrado: PostSchema | undefined =
              await PostsCollection.findOne({ _id: post });

            if (!postEncontrado) {
              throw new Error(`Esta id: ${post} no esta en la base de datos`);
            }

            return postEncontrado;
          }
        );

      const postsEncontrados: (Omit<Post, "id" | "comentarios"> & {
        _id: ObjectId;
        comentarios: ObjectId[];
      })[] = await Promise.all(postsPromesas);

      const comentariosIds: ObjectId[] = postsEncontrados.flatMap(
        ({ comentarios }) => {
          return comentarios;
        }
      );

      const comentariosPromesas = comentariosIds.map(async (comentario) => {
        const comentarioEncontrado: ComentarioSchema | undefined =
          await ComentariosCollection.findOne({
            _id: new ObjectId(comentario),
          });

        if (!comentarioEncontrado) {
          throw new Error(`Esta id: ${comentario} no esta en la base de datos`);
        }

        return comentarioEncontrado;
      });

      const comentariosEncontrados = await Promise.all(comentariosPromesas);

      await UsuariosCollection.deleteOne({
        _id: new ObjectId(user.id),
      });

      postsEncontrados.map(async (post) => {
        await PostsCollection.deleteOne({ _id: post._id });
      });

      comentariosEncontrados.map(async (comentario) => {
        await ComentariosCollection.deleteOne({
          _id: comentario._id,
        });
      });

      return `Se ha eliminado toda la informacion del usuario ${user.username}`;
    } catch (error) {
      throw new Error(error);
    }
  },

  escribirComentarios: async (
    _: unknown,
    args: { idPost: string; token: string; contenido: string }
  ): Promise<ComentarioSchema> => {
    try {
      const { idPost, token, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      const postEncontrado: PostSchema | undefined =
        await PostsCollection.findOne({
          _id: new ObjectId(idPost),
        });

      if (!postEncontrado) {
        throw new Error("No existe un post con ese id");
      }

      const fecha = new Date();

      const addComentario: ObjectId = await ComentariosCollection.insertOne({
        contenido: contenido,
        fechaCreacion: fecha,
      });

      await PostsCollection.updateOne(
        { _id: new ObjectId(idPost) },
        {
          $push: {
            comentarios: {
              $each: [addComentario],
            },
          },
        }
      );

      return {
        _id: addComentario,
        contenido: contenido,
        fechaCreacion: fecha,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  escribirPost: async (
    _: unknown,
    args: { token: string; title: string; contenido: string }
  ): Promise<PostSchema> => {
    try {
      const { token, title, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        throw new Error("El usuario se ha registrado como normal");
      }

      const postEncontrado: PostSchema | undefined =
        await PostsCollection.findOne({
          title: title,
        });

      if (postEncontrado) {
        throw new Error("Ya existe un post con ese titulo");
      }

      const fecha = new Date();

      const addPost: ObjectId = await PostsCollection.insertOne({
        title: title,
        contenido: contenido,
        fechaPost: fecha,
        comentarios: [],
      });

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $push: {
            postCreados: {
              $each: [addPost],
            },
          },
        }
      );

      return {
        _id: addPost,
        title: title,
        contenido: contenido,
        fechaPost: fecha,
        comentarios: [],
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  updateComentario: async (
    _: unknown,
    args: {
      idComentario: string;
      idPost: string;
      token: string;
      contenido: string;
    }
  ): Promise<ComentarioSchema> => {
    try {
      const { idComentario, idPost, token, contenido } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        throw new Error("El usuario se ha registrado como normal");
      }

      const postEncontrado: PostSchema | undefined =
        await PostsCollection.findOne({
          _id: new ObjectId(idPost),
        });

      if (!postEncontrado) {
        throw new Error(
          "No existe un post con ese id con el usuario seleccionado "
        );
      }

      const comentarioEncontrado: ComentarioSchema | undefined =
        await ComentariosCollection.findOne({
          _id: new ObjectId(idComentario),
        });

      if (!comentarioEncontrado) {
        throw new Error(
          "No existe un comentario con ese id con el usuario seleccionado "
        );
      }

      await ComentariosCollection.updateOne(
        { _id: new ObjectId(idComentario) },
        {
          $set: {
            contenido: contenido,
          },
        }
      );

      return {
        _id: new ObjectId(idComentario),
        contenido: contenido,
        fechaCreacion: comentarioEncontrado.fechaCreacion,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  updatePost: async (
    _: unknown,
    args: {
      idPost: string;
      token: string;
      titleNew?: string;
      contenidoNew?: string;
    }
  ): Promise<PostSchema> => {
    try {
      const { idPost, token, titleNew, contenidoNew } = args;

      const actualizarParametros: { titleNew?: string; contenidoNew?: string } =
        {};

      if (titleNew) {
        actualizarParametros.titleNew = titleNew;
      }

      if (contenidoNew) {
        actualizarParametros.contenidoNew = contenidoNew;
      }

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        throw new Error("El usuario se ha registrado como normal");
      }

      const postEncontrado: PostSchema | undefined =
        await PostsCollection.findOne({
          _id: new ObjectId(idPost),
        });

      if (!postEncontrado) {
        throw new Error(
          "No existe un post con ese id con el usuario seleccionado "
        );
      }

      await PostsCollection.updateOne(
        { _id: postEncontrado._id },
        {
          $set: actualizarParametros,
        }
      );

      return {
        _id: postEncontrado._id,
        title: actualizarParametros.titleNew || postEncontrado.title,
        contenido:
          actualizarParametros.contenidoNew || postEncontrado.contenido,
        fechaPost: postEncontrado.fechaPost,
        comentarios: postEncontrado.comentarios.map((comentario) => {
          return new ObjectId(comentario);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteComentario: async (
    _: unknown,
    args: { idComentario: string; token: string }
  ): Promise<ComentarioSchema> => {
    try {
      const { idComentario, token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        throw new Error("El usuario se ha registrado como normal");
      }

      const comentarioEncontrado = await ComentariosCollection.findOne({
        _id: new ObjectId(idComentario),
      });

      if (!comentarioEncontrado) {
        throw new Error("No existe el id del comentario");
      }

      const encontrarComentarioEnPost = await PostsCollection.findOne({
        comentarios: new ObjectId(idComentario),
      });

      await ComentariosCollection.deleteOne({
        _id: new ObjectId(idComentario),
      });

      await PostsCollection.updateOne(
        { _id: encontrarComentarioEnPost?._id },
        {
          $pull: {
            comentarios: new ObjectId(idComentario),
          },
        }
      );

      return {
        _id: new ObjectId(idComentario),
        contenido: comentarioEncontrado.contenido,
        fechaCreacion: comentarioEncontrado.fechaCreacion,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  deletePost: async (
    _: unknown,
    args: { idPost: string; token: string }
  ): Promise<PostSchema> => {
    try {
      const { idPost, token } = args;

      const user: Usuario = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET")!
      )) as Usuario;

      if (!user.inicioSesionCuenta) {
        throw new Error("No tiene iniciada sesion");
      }

      if (user.tipoUsuario.toString() === "REGISTRADO_NORMAL") {
        throw new Error("El usuario se ha registrado como normal");
      }

      const postEncontrado = await PostsCollection.findOne({
        _id: new ObjectId(idPost),
      });

      if (!postEncontrado) {
        throw new Error("No existe el id del post");
      }

      await PostsCollection.deleteOne({
        _id: new ObjectId(idPost),
      });

      await UsuariosCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $pull: {
            postCreados: new ObjectId(idPost),
          },
        }
      );

      return {
        _id: postEncontrado._id,
        title: postEncontrado.title,
        contenido: postEncontrado.contenido,
        fechaPost: postEncontrado.fechaPost,
        comentarios: postEncontrado.comentarios.map((comentario) => {
          return new ObjectId(comentario);
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
