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
