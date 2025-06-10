import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { config } from "../config/config";

// MongoDB Configuration
const username = config.dbUser;
const password = config.dbPassword;
const authDatabaseName = config.dbNameAuth; // The database to authenticate against
const databaseName = config.dbName
const uri = `mongodb://${username}:${password}@192.168.1.237:27017/${authDatabaseName}`;

const clientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    authSource: authDatabaseName,
};

const client = new MongoClient(uri, clientOptions);
let databaseInstance: import("mongodb").Db;

// Connect to MongoDB
export async function initializeDatabase() {
    try {
        if (!databaseInstance) {
            await client.connect();
            await client.db(authDatabaseName).command({ ping: 1 });
            databaseInstance = client.db(databaseName);
            console.log("Successfully connected to MongoDB!");
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }

    return databaseInstance;
}

export function closeConnection() {
    console.log("MongoDB connection closed.");
    return client.close();
}
