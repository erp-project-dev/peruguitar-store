import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not defined");
}

let client: MongoClient;
let db: Db;

export async function getDbInstance(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }

  return db;
}
