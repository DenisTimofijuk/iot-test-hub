// import { Db } from "mongodb";
// import { initializeDatabase } from "../models/mongodb";
// import { Reading } from "../types/Reading";

// export default class DataProcessor {
//     database: Db | null;
//     constructor() {
//         this.database = null;
//     }

//     async initialize() {
//         if (!this.database) {
//             this.database = await initializeDatabase();
//         }
//         return this.database;
//     }

//     // Batch insert sensor readings with validation and error handling
//     async batchInsertReadings(readings: Reading) {
//         try {
//             if (!this.database) return;

//             await this.initialize();
//             const collection = this.database.collection("readings");

//             if (!Array.isArray(readings) || readings.length === 0) {
//                 throw new Error("Readings must be a non-empty array");
//             }

//             // Transform readings to ensure proper timestamp format
//             const processedReadings = readings.map((reading) => ({
//                 ...reading,
//                 timestamp: new Date(reading.timestamp),
//                 _id: undefined, // Let MongoDB generate _id
//             }));

//             // Use ordered: false for better performance (continues on individual errors)
//             const result = await collection.insertMany(processedReadings, {
//                 ordered: false,
//                 writeConcern: { w: "majority", wtimeout: 5000 },
//             });

//             console.log(`✅ Batch inserted ${result.insertedCount} readings`);
//             return {
//                 success: true,
//                 insertedCount: result.insertedCount,
//                 insertedIds: result.insertedIds,
//             };
//         } catch (error: any) {
//             console.error("❌ Batch insert failed:", error);

//             // Handle partial success in bulk operations
//             if (error.code === 11000) {
//                 // Duplicate key error
//                 return {
//                     success: false,
//                     error: "Duplicate readings detected",
//                     insertedCount: error.result?.insertedCount || 0,
//                 };
//             }

//             throw error;
//         }
//     }

//     // Data transformation utilities
//     // transformRawSensorData(rawData: Reading) {
//     //     const transformed = {
//     //         device_id: rawData.device_id,
//     //         timestamp: new Date(rawData.timestamp || Date.now()),
//     //     };

//     //     // Transform temperature (handle different units)
//     //     if (rawData. temp !== undefined) {
//     //         transformed.temperature = this.convertTemperature(rawData.temp, rawData.tempUnit || 'C');
//     //     }

//     //     // Transform humidity
//     //     if (rawData.humidity !== undefined) {
//     //         transformed.humidity = Math.max(0, Math.min(100, parseFloat(rawData.humidity)));
//     //     }

//     //     // Transform air quality readings
//     //     if (rawData.co2 !== undefined) {
//     //         transformed.co2_ppm = Math.max(0, parseInt(rawData.co2));
//     //     }

//     //     if (rawData.tvoc !== undefined) {
//     //         transformed.tvoc_ppb = Math.max(0, parseInt(rawData.tvoc));
//     //     }

//     //     // Transform particulate matter
//     //     if (rawData.pm25 !== undefined) {
//     //         transformed.pm25 = Math.max(0, parseFloat(rawData.pm25));
//     //     }

//     //     if (rawData.pm10 !== undefined) {
//     //         transformed.pm10 = Math.max(0, parseFloat(rawData.pm10));
//     //     }

//     //     // Transform pressure (handle different units)
//     //     if (rawData.pressure !== undefined) {
//     //         transformed.pressure = this.convertPressure(rawData.pressure, rawData.pressureUnit || 'hPa');
//     //     }

//     //     return transformed;
//     // }

//     // convertTemperature(temp, unit) {
//     //     const temperature = parseFloat(temp);
//     //     switch (unit.toUpperCase()) {
//     //         case 'F':
//     //             return (temperature - 32) * 5/9; // Convert Fahrenheit to Celsius
//     //         case 'K':
//     //             return temperature - 273.15; // Convert Kelvin to Celsius
//     //         default:
//     //             return temperature; // Assume Celsius
//     //     }
//     // }

//     // convertPressure(pressure, unit) {
//     //     const press = parseFloat(pressure);
//     //     switch (unit.toLowerCase()) {
//     //         case 'pa':
//     //             return press / 100; // Convert Pa to hPa
//     //         case 'kpa':
//     //             return press * 10; // Convert kPa to hPa
//     //         case 'bar':
//     //             return press * 1000; // Convert bar to hPa
//     //         default:
//     //             return press; // Assume hPa
//     //     }
//     // }

//     // Data aggregation functions
//     async getAggregatedData(options: {
//         device_id: string;
//         startDate: string;
//         endDate: string;
//         granularity: string;
//         metrics: string[];
//     }) {
//         try {
//             await this.initialize();
//             if (!this.database) return;

//             const collection = this.database.collection<Reading>("readings");

//             const {
//                 device_id,
//                 startDate,
//                 endDate,
//                 granularity = "hour",
//                 metrics = ["temperature", "humidity"],
//             } = options;

//             const matchStage = {
//                 timestamp: {
//                     $gte: new Date(startDate),
//                     $lte: new Date(endDate),
//                 },
//                 device_id: device_id,
//             };

//             // Create aggregation pipeline
//             const pipeline = [
//                 { $match: matchStage },
//                 {
//                     $group: {
//                         _id: this.getDateGrouping(granularity),
//                         ...this.createMetricAggregation(metrics),
//                         count: { $sum: 1 },
//                     },
//                 },
//                 { $sort: { _id: 1 } },
//             ];

//             const result = await collection.aggregate(pipeline).toArray();

//             return {
//                 success: true,
//                 data: result,
//                 granularity,
//                 period: { startDate, endDate },
//                 metrics,
//             };
//         } catch (error) {
//             console.error("❌ Aggregation failed:", error);
//             throw error;
//         }
//     }

//     getDateGrouping(granularity: string) {
//         const baseDate = {
//             year: { $year: "$timestamp" },
//             month: { $month: "$timestamp" },
//             day: { $dayOfMonth: "$timestamp" },
//         };

//         switch (granularity) {
//             case "minute":
//                 return {
//                     ...baseDate,
//                     hour: { $hour: "$timestamp" },
//                     minute: { $minute: "$timestamp" },
//                 };
//             case "hour":
//                 return {
//                     ...baseDate,
//                     hour: { $hour: "$timestamp" },
//                 };
//             case "day":
//                 return baseDate;
//             case "week":
//                 return {
//                     year: { $year: "$timestamp" },
//                     week: { $week: "$timestamp" },
//                 };
//             case "month":
//                 return {
//                     year: { $year: "$timestamp" },
//                     month: { $month: "$timestamp" },
//                 };
//             default:
//                 return baseDate;
//         }
//     }

//     createMetricAggregation(metrics: string[]) {
//         const aggregation: {[K: string]: Object} = {};

//         metrics.forEach((metric) => {
//             aggregation[`${metric}_avg`] = { $avg: `$${metric}` };
//             aggregation[`${metric}_min`] = { $min: `$${metric}` };
//             aggregation[`${metric}_max`] = { $max: `$${metric}` };
//         });

//         return aggregation;
//     }

//     // Data cleanup and archiving
//     async cleanupOldData(retentionDays = 365) {
//         try {
//             await this.initialize();
//             if(!this.database) return;

//             const collection = this.database.collection("readings");

//             const cutoffDate = new Date();
//             cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

//             const result = await collection.deleteMany({
//                 timestamp: { $lt: cutoffDate },
//             });

//             console.log(`🧹 Cleaned up ${result.deletedCount} old readings`);
//             return {
//                 success: true,
//                 deletedCount: result.deletedCount,
//                 cutoffDate,
//             };
//         } catch (error) {
//             console.error("❌ Cleanup failed:", error);
//             throw error;
//         }
//     }

//     async archiveOldData(archiveDays = 90) {
//         try {
//             await this.initialize();
//             if(!this.database) return;

//             const readingsCollection = this.database.collection("readings");
//             const archiveCollection =
//                 this.database.collection("readings_archive");

//             const cutoffDate = new Date();
//             cutoffDate.setDate(cutoffDate.getDate() - archiveDays);

//             // Find documents to archive
//             const documentsToArchive = await readingsCollection
//                 .find({
//                     timestamp: { $lt: cutoffDate },
//                 })
//                 .toArray();

//             if (documentsToArchive.length === 0) {
//                 console.log("📦 No documents to archive");
//                 return { success: true, archivedCount: 0 };
//             }

//             // Insert into archive collection
//             await archiveCollection.insertMany(documentsToArchive);

//             // Remove from main collection
//             const deleteResult = await readingsCollection.deleteMany({
//                 timestamp: { $lt: cutoffDate },
//             });

//             console.log(`📦 Archived ${documentsToArchive.length} readings`);
//             return {
//                 success: true,
//                 archivedCount: documentsToArchive.length,
//                 deletedCount: deleteResult.deletedCount,
//                 cutoffDate,
//             };
//         } catch (error) {
//             console.error("❌ Archive failed:", error);
//             throw error;
//         }
//     }

//     // Calculate device statistics
//     async getDeviceStatistics(device_id: string) {
//         try {
//             await this.initialize();
//             if(!this.database) return;

//             const collection = this.database.collection("readings");

//             const pipeline = [
//                 { $match: { device_id } },
//                 {
//                     $group: {
//                         _id: "$device_id",
//                         totalReadings: { $sum: 1 },
//                         firstReading: { $min: "$timestamp" },
//                         lastReading: { $max: "$timestamp" },
//                         avgTemperature: { $avg: "$temperature" },
//                         avgHumidity: { $avg: "$humidity" },
//                         avgCO2: { $avg: "$co2_ppm" },
//                         maxTemperature: { $max: "$temperature" },
//                         minTemperature: { $min: "$temperature" },
//                         maxHumidity: { $max: "$humidity" },
//                         minHumidity: { $min: "$humidity" },
//                     },
//                 },
//             ];

//             const result = await collection.aggregate(pipeline).toArray();

//             if (result.length === 0) {
//                 return { success: false, error: "Device not found" };
//             }

//             return {
//                 success: true,
//                 statistics: result[0],
//             };
//         } catch (error) {
//             console.error("❌ Statistics calculation failed:", error);
//             throw error;
//         }
//     }
// }