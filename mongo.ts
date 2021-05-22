import { MongoClient } from "./deps.ts";

const client = new MongoClient();
//Connecting to a Mongo Atlas Database
await client.connect({
  db: "<db_name>",
  tls: true,
  servers: [
    {
      host: "<db_cluster_url>",
      port: 27017,
    },
  ],
  credential: {
    username: "<username>",
    password: "<password>",
    db: "<db_name>",
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database("deno-survey-db");

export const usersCollection = db.collection("users");
