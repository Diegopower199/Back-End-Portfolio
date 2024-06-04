import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { Collection, Database, MongoClient } from "mongo";
import { MatchSchema, PlayerSchema, TeamSchema, UserSchema } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = Deno.env.get("MONGO_USR");
  const mongo_pwd = Deno.env.get("MONGO_PWD");
  const db_name = Deno.env.get("DB_NAME");
  const mongo_uri = Deno.env.get("MONGO_URI");

  if (!mongo_usr || !mongo_pwd || !db_name || !mongo_uri) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }

  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);

  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const MatchCollection: Collection<MatchSchema> =
  db.collection<MatchSchema>("Matches");
export const TeamCollection: Collection<TeamSchema> =
  db.collection<TeamSchema>("Teams");
export const PlayerCollection: Collection<PlayerSchema> =
  db.collection<PlayerSchema>("Players");
export const UsersCollection: Collection<UserSchema> =
  db.collection<UserSchema>("Users");
