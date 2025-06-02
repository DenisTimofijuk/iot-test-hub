// import { Db } from "mongodb";
// import { initializeDatabase } from "../models/mongodb";

// type CollectionType = {
//     documentCount: number;
//     avgDocumentSize: number;
//     totalSize: number;
//     indexCount: number;
//     indexSize: number;
// };

// type StorageType = {
//     dataSize: number;
//     storageSize: number;
//     indexSize: number;
//     totalSize: number;
//     collections: number;
//     objects: number;
//     avgObjSize: number;
// };

// type ConnectionType = {
//     current: number;
//     available: number;
//     totalCreated: number;
// }

// export default class DatabaseHealthMonitor {
//     database: Db | null;
//     healthMetrics: {
//         status: string;
//         lastCheck: Date | null;
//         responseTime: number | null;
//         collections: { [k: string]: CollectionType };
//         indexes: {};
//         storage: StorageType | {};
//         connections: ConnectionType | {};
//         errors: {
//             message: string;
//             timestamp: Date;
//             stack?: string;
//             severity?: string;
//         }[];
//     };
//     monitoringInterval: NodeJS.Timeout | null;
//     constructor() {
//         this.database = null;
//         this.healthMetrics = {
//             status: "unknown",
//             lastCheck: null,
//             responseTime: null,
//             collections: {},
//             indexes: {},
//             storage: {},
//             connections: {},
//             errors: [],
//         };
//         this.monitoringInterval = null;
//     }

//     async initialize() {
//         if (!this.database) {
//             this.database = await initializeDatabase();
//         }
//         return this.database;
//     }

//     async performHealthCheck() {
//         const startTime = Date.now();

//         try {
//             await this.initialize();

//             this.healthMetrics = {
//                 status: "healthy",
//                 lastCheck: new Date(),
//                 responseTime: null,
//                 collections: {},
//                 indexes: {},
//                 storage: {},
//                 connections: {},
//                 errors: [],
//             };

//             // Test basic connectivity
//             await this.checkConnectivity();

//             // Check collection health
//             // await this.checkCollections();

//             // Check index performance
//             // await this.checkIndexes();

//             // Check storage metrics
//             await this.checkStorage();

//             // Check connection pool
//             await this.checkConnections();

//             this.healthMetrics.responseTime = Date.now() - startTime;

//             console.log(
//                 `✅ Health check completed in ${this.healthMetrics.responseTime}ms`
//             );
//             return this.healthMetrics;
//         } catch (error: any) {
//             this.healthMetrics.status = "unhealthy";
//             this.healthMetrics.responseTime = Date.now() - startTime;
//             this.healthMetrics.errors.push({
//                 message: error.message,
//                 timestamp: new Date(),
//                 stack: error.stack,
//             });

//             console.error("❌ Health check failed:", error);
//             return this.healthMetrics;
//         }
//     }

//     async checkConnectivity() {
//         try {
//             // Simple ping to test connectivity
//             if (!this.database) return;

//             const adminDb = this.database.admin();
//             const result = await adminDb.ping();

//             if (result.ok !== 1) {
//                 throw new Error("Database ping failed");
//             }

//             // Test a simple query
//             const testStart = Date.now();
//             await this.database.collection("device_status").countDocuments({});
//             const queryTime = Date.now() - testStart;

//             if (queryTime > 1000) {
//                 // More than 1 second is concerning
//                 this.healthMetrics.errors.push({
//                     message: `Slow query response: ${queryTime}ms`,
//                     timestamp: new Date(),
//                     severity: "warning",
//                 });
//             }
//         } catch (error: any) {
//             throw new Error(`Connectivity check failed: ${error.message}`);
//         }
//     }

//     // async checkCollections() {
//     //     try {
//     //         if (!this.database) return;

//     //         const collections = await this.database.listCollections().toArray();

//     //         for (const collection of collections) {
//     //             const collectionName = collection.name;
//     //             const coll = this.database.collection(collectionName);

//     //             // Get collection stats
//     //             const stats = await coll.stats();

//     //             this.healthMetrics.collections[collectionName] = {
//     //                 documentCount: stats.count || 0,
//     //                 avgDocumentSize: stats.avgObjSize || 0,
//     //                 totalSize: stats.size || 0,
//     //                 indexCount: stats.nindexes || 0,
//     //                 indexSize: stats.totalIndexSize || 0,
//     //             };

//     //             // Check for potential issues
//     //             if (stats.avgObjSize > 1024 * 1024) {
//     //                 // 1MB average document size
//     //                 this.healthMetrics.errors.push({
//     //                     message: `Large average document size in ${collectionName}: ${Math.round(
//     //                         stats.avgObjSize / 1024
//     //                     )}KB`,
//     //                     timestamp: new Date(),
//     //                     severity: "warning",
//     //                 });
//     //             }
//     //         }
//     //     } catch (error) {
//     //         throw new Error(`Collection check failed: ${error.message}`);
//     //     }
//     // }

//     // async checkIndexes() {
//     //     try {
//     //         const collections = ["readings", "device_status"];
//     //         if(!this.database) return;

//     //         for (const collectionName of collections) {
//     //             const collection = this.database.collection(collectionName);
//     //             const indexStats = await collection.indexStats().toArray();

//     //             this.healthMetrics.indexes[collectionName] = {};

//     //             for (const indexStat of indexStats) {
//     //                 const indexName = indexStat.name;
//     //                 this.healthMetrics.indexes[collectionName][indexName] = {
//     //                     accesses: indexStat.accesses?.ops || 0,
//     //                     since: indexStat.accesses?.since || null,
//     //                 };

//     //                 // Check for unused indexes
//     //                 if (indexStat.accesses?.ops === 0 && indexName !== "_id_") {
//     //                     this.healthMetrics.errors.push({
//     //                         message: `Unused index detected: ${collectionName}.${indexName}`,
//     //                         timestamp: new Date(),
//     //                         severity: "info",
//     //                     });
//     //                 }
//     //             }
//     //         }
//     //     } catch (error) {
//     //         // Index stats might not be available in all MongoDB versions
//     //         console.warn("Index stats check skipped:", error.message);
//     //     }
//     // }

//     async checkStorage() {
//         try {
//             if (!this.database) return;

//             const dbStats = await this.database.stats();

//             this.healthMetrics.storage = {
//                 dataSize: dbStats.dataSize || 0,
//                 storageSize: dbStats.storageSize || 0,
//                 indexSize: dbStats.indexSize || 0,
//                 totalSize: (dbStats.dataSize || 0) + (dbStats.indexSize || 0),
//                 collections: dbStats.collections || 0,
//                 objects: dbStats.objects || 0,
//                 avgObjSize: dbStats.avgObjSize || 0,
//             };

//             // Check storage thresholds (you may want to adjust these)
//             const totalSizeGB =
//                 (this.healthMetrics.storage as StorageType).totalSize /
//                 (1024 * 1024 * 1024);

//             if (totalSizeGB > 10) {
//                 // More than 10GB
//                 this.healthMetrics.errors.push({
//                     message: `Large database size: ${totalSizeGB.toFixed(2)}GB`,
//                     timestamp: new Date(),
//                     severity: "warning",
//                 });
//             }
//         } catch (error: any) {
//             throw new Error(`Storage check failed: ${error.message}`);
//         }
//     }

//     async checkConnections() {
//         try {
//             if (!this.database) return;

//             const adminDb = this.database.admin();
//             const serverStatus = await adminDb.serverStatus();

//             if (serverStatus.connections) {
//                 this.healthMetrics.connections = {
//                     current: serverStatus.connections.current || 0,
//                     available: serverStatus.connections.available || 0,
//                     totalCreated: serverStatus.connections.totalCreated || 0,
//                 };

//                 // Check connection usage
//                 const usagePercent =
//                     (serverStatus.connections.current /
//                         (serverStatus.connections.current +
//                             serverStatus.connections.available)) *
//                     100;

//                 if (usagePercent > 80) {
//                     this.healthMetrics.errors.push({
//                         message: `High connection usage: ${usagePercent.toFixed(
//                             1
//                         )}%`,
//                         timestamp: new Date(),
//                         severity: "warning",
//                     });
//                 }
//             }
//         } catch (error: any) {
//             // Server status might not be available in all environments
//             console.warn("Connection check skipped:", error.message);
//         }
//     }

//     // async getSlowQueries(limit = 10) {
//     //     try {
//     //         await this.initialize();
//     //         if (!this.database) return;

//     //         const adminDb = this.database.admin();

//     //         // This requires profiling to be enabled
//     //         const profilingData = await adminDb
//     //             .db()
//     //             .collection("system.profile")
//     //             .find({ ts: { $gte: new Date(Date.now() - 3600000) } }) // Last hour
//     //             .sort({ ts: -1 })
//     //             .limit(limit)
//     //             .toArray();

//     //         return profilingData.map((query) => ({
//     //             timestamp: query.ts,
//     //             duration: query.millis,
//     //             command: query.command,
//     //             collection: query.ns,
//     //         }));
//     //     } catch (error) {
//     //         console.warn("Slow query check skipped:", error.message);
//     //         return [];
//     //     }
//     // }

//     // async enableProfiling(slowMs = 100) {
//     //     try {
//     //         await this.initialize();
//     //         if (!this.database) return;

//     //         const adminDb = this.database.admin();

//     //         // Enable profiling for slow operations
//     //         await adminDb.db().runCommand({
//     //             profile: 2,
//     //             slowms: slowMs,
//     //         });

//     //         console.log(
//     //             `✅ Database profiling enabled for queries > ${slowMs}ms`
//     //         );
//     //         return true;
//     //     } catch (error) {
//     //         console.error("❌ Failed to enable profiling:", error);
//     //         return false;
//     //     }
//     // }

//     // async disableProfiling() {
//     //     try {
//     //         await this.initialize();
//     //         if (!this.database) return;
//     //         const adminDb = this.database.admin();

//     //         await adminDb.db().runCommand({ profile: 0 });

//     //         console.log("✅ Database profiling disabled");
//     //         return true;
//     //     } catch (error) {
//     //         console.error("❌ Failed to disable profiling:", error);
//     //         return false;
//     //     }
//     // }

//     // Get formatted health report
//     getHealthReport() {
//         const report = {
//             status: this.healthMetrics.status,
//             lastCheck: this.healthMetrics.lastCheck,
//             responseTime: `${this.healthMetrics.responseTime}ms`,
//             summary: {
//                 totalCollections: Object.keys(this.healthMetrics.collections)
//                     .length,
//                 totalDocuments: Object.values(
//                     this.healthMetrics.collections
//                 ).reduce((sum, col) => sum + col.documentCount, 0),
//                 totalStorageSize: this.formatBytes(
//                     (this.healthMetrics.storage as StorageType).totalSize || 0
//                 ),
//                 activeConnections: (this.healthMetrics.connections as ConnectionType).current || 0,
//                 warningCount: this.healthMetrics.errors.filter(
//                     (e) => e.severity === "warning"
//                 ).length,
//                 errorCount: this.healthMetrics.errors.filter(
//                     (e) => e.severity === "error"
//                 ).length,
//             },
//             details: {
//                 collections: this.healthMetrics.collections,
//                 storage: this.healthMetrics.storage,
//                 connections: this.healthMetrics.connections,
//                 indexes: this.healthMetrics.indexes,
//             },
//             issues: this.healthMetrics.errors,
//         };

//         return report;
//     }

//     formatBytes(bytes: number) {
//         if (bytes === 0) return "0 Bytes";

//         const k = 1024;
//         const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));

//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     }

//     // Schedule periodic health checks
//     startHealthMonitoring(intervalMinutes = 15) {
//         console.log(
//             `🏥 Starting health monitoring (every ${intervalMinutes} minutes)`
//         );

//         // Initial health check
//         this.performHealthCheck();

//         // Schedule periodic checks
//         this.monitoringInterval = setInterval(async () => {
//             await this.performHealthCheck();

//             // Log critical issues
//             const criticalErrors = this.healthMetrics.errors.filter(
//                 (e) => e.severity === "error"
//             );
//             if (criticalErrors.length > 0) {
//                 console.error(
//                     "🚨 Critical database issues detected:",
//                     criticalErrors
//                 );
//             }
//         }, intervalMinutes * 60 * 1000);

//         return this.monitoringInterval;
//     }

//     stopHealthMonitoring() {
//         if (this.monitoringInterval) {
//             clearInterval(this.monitoringInterval);
//             this.monitoringInterval = null;
//             console.log("🏥 Health monitoring stopped");
//         }
//     }

//     // Performance benchmarking
//     async benchmarkQueries() {
//         try {
//             await this.initialize();
//             const results: {
//                 [K: string]: { duration: string; performance: string };
//             } = {};

//             // Benchmark common queries
//             const queries = [
//                 {
//                     name: "simple_count",
//                     operation: () => {
//                         if (!this.database) return;
//                         return this.database
//                             .collection("readings")
//                             .countDocuments({});
//                     },
//                 },
//                 {
//                     name: "device_latest_reading",
//                     operation: () => {
//                         if (!this.database) return;
//                         return this.database
//                             .collection("readings")
//                             .findOne({}, { sort: { timestamp: -1 } });
//                     },
//                 },
//                 {
//                     name: "time_range_query",
//                     operation: () => {
//                         if (!this.database) return;
//                         return this.database
//                             .collection("readings")
//                             .find({
//                                 timestamp: {
//                                     $gte: new Date(
//                                         Date.now() - 24 * 60 * 60 * 1000
//                                     ),
//                                 },
//                             })
//                             .limit(100)
//                             .toArray();
//                     },
//                 },
//                 {
//                     name: "aggregation_query",
//                     operation: () => {
//                         if (!this.database) return;
//                         return this.database
//                             .collection("readings")
//                             .aggregate([
//                                 {
//                                     $match: {
//                                         timestamp: {
//                                             $gte: new Date(
//                                                 Date.now() - 60 * 60 * 1000
//                                             ),
//                                         },
//                                     },
//                                 },
//                                 {
//                                     $group: {
//                                         _id: "$device_id",
//                                         avgTemp: { $avg: "$temperature" },
//                                         count: { $sum: 1 },
//                                     },
//                                 },
//                             ])
//                             .toArray();
//                     },
//                 },
//             ];

//             for (const query of queries) {
//                 const startTime = Date.now();
//                 await query.operation();
//                 const duration = Date.now() - startTime;

//                 results[query.name] = {
//                     duration: `${duration}ms`,
//                     performance:
//                         duration < 100
//                             ? "excellent"
//                             : duration < 500
//                             ? "good"
//                             : duration < 1000
//                             ? "fair"
//                             : "poor",
//                 };
//             }

//             return results;
//         } catch (error) {
//             console.error("❌ Query benchmark failed:", error);
//             throw error;
//         }
//     }
// }
