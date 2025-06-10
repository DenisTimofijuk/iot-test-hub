import { closeConnection, initializeDatabase } from "./models/mongodb";

export async function setupDatabase() {
    try {
        const database = await initializeDatabase();
        // Create time-series collection for readings
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map((col) => col.name);

        if (!collectionNames.includes("readings")) {
            await database.createCollection("readings", {
                timeseries: {
                    timeField: "timestamp",
                    metaField: "device_id",
                    granularity: "seconds",
                },
            });
            console.log("✅ Created time-series collection: readings");
        }

        // Create users collection with validation rules
        if (!collectionNames.includes("users")) {
            await database.createCollection("users", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["email", "created_at"],
                        properties: {
                            email: {
                                bsonType: "string",
                                pattern:
                                    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                                description: "Must be a valid email address",
                            },
                            username: {
                                bsonType: "string",
                                minLength: 3,
                                maxLength: 50,
                                description:
                                    "Username must be between 3-50 characters",
                            },
                            password_hash: {
                                bsonType: "string",
                                description: "Hashed password",
                            },
                            role: {
                                bsonType: "string",
                                enum: ["admin", "user", "viewer"],
                                description: "User role",
                            },
                            active: {
                                bsonType: "bool",
                                description: "Whether user account is active",
                            },
                            created_at: {
                                bsonType: "date",
                                description: "Account creation timestamp",
                            },
                            updated_at: {
                                bsonType: "date",
                                description: "Last update timestamp",
                            },
                        },
                    },
                },
            });

            // Create indexes for better performance
            await database
                .collection("users")
                .createIndex({ email: 1 }, { unique: true });
            await database
                .collection("users")
                .createIndex({ username: 1 }, { unique: true, sparse: true });
            await database.collection("users").createIndex({ created_at: 1 });

            console.log(
                "✅ Created users collection with validation and indexes"
            );
        }

        // Create device_status with validation rules
        if (!collectionNames.includes("device_status")) {
            await database.createCollection("device_status", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["device_id", "last_seen", "system"],
                        properties: {
                            device_id: { bsonType: "string" },
                            last_seen: { bsonType: "long" },
                            system: {
                                bsonType: "object",
                                required: [
                                    "free_heap",
                                    "wifi_connected",
                                    "sensors_ok",
                                ],
                                properties: {
                                    free_heap: { bsonType: "int" },
                                    wifi_connected: { bsonType: "bool" },
                                    sensors_ok: { bsonType: "bool" },
                                },
                            },
                            dht22_status: { bsonType: "string" },
                            ccs811_status: { bsonType: "string" },
                        },
                    },
                },
            });
            console.log("✅ Created collection with validation: device_status");
        }

        console.log("✅ Mongodatabase setup complete.");
    } catch (err) {
        console.error("❌ Mongodatabase setup failed:", err);
    } finally {
        // await client.close();
        await closeConnection();
    }
}

// Optional: call immediately if running as script
if (require.main === module) {
    setupDatabase();
}
