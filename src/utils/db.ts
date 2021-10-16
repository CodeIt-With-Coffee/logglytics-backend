import { MongoClient } from "mongodb";

const pool = (() => {
  let client: MongoClient = null;
  const conn = async () => {
    let mongoDb: MongoClient;
    try {
      mongoDb =
        client ||
        (await MongoClient.connect(process.env.MONGODB_URI, {
          maxPoolSize: 10,
        }));
      client = mongoDb;
    } catch (e: any) {
      console.error(e);
      mongoDb = null;
    }
    return mongoDb;
  };
  const db = async () => {
    return (await conn())?.db(process.env.DB);
  };
  return db;
})();

export default pool;
