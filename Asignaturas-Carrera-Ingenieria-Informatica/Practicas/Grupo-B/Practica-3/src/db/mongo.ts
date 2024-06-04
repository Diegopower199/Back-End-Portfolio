import { Collection, Database, MongoClient } from "mongo";
import { config } from "std/dotenv/mod.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "./schemas.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = Deno.env.get("MONGO_USR");
  const mongo_pwd = Deno.env.get("MONGO_PWD");
  const db_name = Deno.env.get("DB_NAME");
  const mongo_uri = Deno.env.get("MONGO_URI");
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);

  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const BooksCollection: Collection<BooksSchema> =
  db.collection<BooksSchema>("Books");
export const UserCollection: Collection<UserSchema> =
  db.collection<UserSchema>("Users");
export const AuthorCollection: Collection<AuthorSchema> =
  db.collection<AuthorSchema>("Authors");
