import { initializeDatabase } from "./mongodb";

export async function createIndexes() {
    try {
        const database = await initializeDatabase();

        // Indexes for readings collection (time-series)
        const readingsCollection = database.collection("readings");

        // Compound index for device queries with time range
        await readingsCollection.createIndex(
            { device_id: 1, timestamp: -1 },
            {
                name: "device_timestamp_idx",
                background: true,
            }
        );

        // Index for time-based queries (dashboard queries)
        await readingsCollection.createIndex(
            { timestamp: -1 },
            {
                name: "timestamp_desc_idx",
                background: true,
            }
        );

        // Compound index for aggregation queries
        await readingsCollection.createIndex(
            { device_id: 1, timestamp: -1, temperature: 1, humidity: 1 },
            {
                name: "device_time_metrics_idx",
                background: true,
            }
        );

        // Sparse index for CO2 readings (not all devices have this sensor)
        await readingsCollection.createIndex(
            { device_id: 1, timestamp: -1, co2_ppm: 1 },
            {
                name: "device_co2_idx",
                sparse: true,
                background: true,
            }
        );

        console.log("✅ Created indexes for readings collection");

        // Indexes for device_status collection
        const deviceStatusCollection = database.collection("device_status");

        // Unique index on device_id
        await deviceStatusCollection.createIndex(
            { device_id: 1 },
            {
                unique: true,
                name: "device_id_unique_idx",
                background: true,
            }
        );

        // Index for finding offline devices
        await deviceStatusCollection.createIndex(
            { last_seen: -1 },
            {
                name: "last_seen_desc_idx",
                background: true,
            }
        );

        // Compound index for system status queries
        await deviceStatusCollection.createIndex(
            { "system.wifi_connected": 1, "system.sensors_ok": 1 },
            {
                name: "system_status_idx",
                background: true,
            }
        );

        // Text index for location searches (if implemented)
        await deviceStatusCollection.createIndex(
            {
                "location.room": "text",
                "location.building": "text",
            },
            {
                name: "location_text_idx",
                background: true,
            }
        );

        console.log("✅ Created indexes for device_status collection");

        console.log("✅ All database indexes created successfully");

        // List all indexes for verification
        const readingsIndexes = await readingsCollection
            .listIndexes()
            .toArray();
        const deviceIndexes = await deviceStatusCollection
            .listIndexes()
            .toArray();

        console.log(
            "📊 Readings collection indexes:",
            readingsIndexes.map((idx) => idx.name)
        );
        console.log(
            "📊 Device status collection indexes:",
            deviceIndexes.map((idx) => idx.name)
        );
    } catch (error) {
        console.error("❌ Error creating indexes:", error);
        throw error;
    }
}

export async function dropIndexes() {
    try {
        const database = await initializeDatabase();

        // Drop all custom indexes (keep _id_ index)
        await database.collection("readings").dropIndexes();
        await database.collection("device_status").dropIndexes();

        console.log("✅ All custom indexes dropped");
    } catch (error) {
        console.error("❌ Error dropping indexes:", error);
        throw error;
    }
}

// export async function getIndexStats() {
//     try {
//         const database = await initializeDatabase();

//         const readingsStats = await database.collection<Reading>("readings").stats();
//         const deviceStats = await database.collection<DeviceStatus>("device_status").stats();

//         console.log("📊 Collection Statistics:");
//         console.log("Readings:", {
//             documents: readingsStats.count,
//             avgObjSize: readingsStats.avgObjSize,
//             totalIndexSize: readingsStats.totalIndexSize,
//             indexSizes: readingsStats.indexSizes,
//         });

//         console.log("Device Status:", {
//             documents: deviceStats.count,
//             avgObjSize: deviceStats.avgObjSize,
//             totalIndexSize: deviceStats.totalIndexSize,
//             indexSizes: deviceStats.indexSizes,
//         });

//         return { readingsStats, deviceStats };
//     } catch (error) {
//         console.error("❌ Error getting index stats:", error);
//         throw error;
//     }
// }