import { Collection, Database, MongoClient } from "mongo";
import { config } from "std/dotenv/mod.ts";
import { MensajeSchema, UsuarioSchema } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_url = Deno.env.get("MONGO_URL");

  if (!mongo_url) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database("Practica5");

  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB Practica5 connected`);

export const UsuarioCollection: Collection<UsuarioSchema> =
  db.collection<UsuarioSchema>("Usuarios");
export const MensajesCollection: Collection<MensajeSchema> =
  db.collection<MensajeSchema>("Mensajes");
