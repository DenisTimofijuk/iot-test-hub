import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import config from '../config/config';

// MongoDB Configuration
const username = config.dbUser;
const password = config.dbPassword;
const authDatabase = config.dbName; // The database to authenticate against
const uri = `mongodb://${username}:${password}@192.168.1.237:27017/${authDatabase}`;

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  authSource: authDatabase,
};

const client = new MongoClient(uri, clientOptions);


let databaseInstance: import("mongodb").Db;

// Connect to MongoDB
async function initializeDatabase() {
  try {
    if (!databaseInstance) {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      databaseInstance = client.db("test_db");
      console.log("Successfully connected to MongoDB!");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

initializeDatabase();

export { databaseInstance as database };