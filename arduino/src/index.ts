import axios from "axios";
import ESP8266Runner from "./ESP8266Runner";
import { SerialOutput } from "./types/SerialOutput";

async function main() {
    const runner = new ESP8266Runner("/dev/ttyUSB0"); // Adjust port as needed

    // Set up event listeners
    runner.on("connected", () => {
        console.log("🟢 Device connected successfully");
    });

    runner.on("connectionFailed", (error) => {
        console.log("🔴 Connection failed:", error.message);
    });

    runner.on("connectionLost", () => {
        console.log("🟡 Connection lost, attempting to reconnect...");
    });

    runner.on("reconnectFailed", () => {
        console.log("🔴 All reconnect attempts failed");
    });

    runner.on("sensorData", async (data: SerialOutput) => {
        console.log("📊 Sensor data received. Saving to Database...");
        try {
            await axios.post("http://localhost:3000/api/devices/readings", {
                temperature: data.dht22.temperature,
                humidity: data.dht22.humidity,
                co2: data.ccs811.co2,
                timestamp: new Date(data.timestamp || Date.now()).toISOString(),
            });
            console.log('Data successfully saved to database.')
        } catch (error) {
            console.error('Failed to save data to database.')
        }
    });

    runner.on("deviceError", (error) => {
        console.log("⚠️  Device error:", error);
    });

    runner.on("rawMessage", (message) => {
        console.log("📝 Raw message:", message);
    });

    runner.on("log", (logEntry) => {
        // Optional: write logs to file or external logging service
        if (logEntry.level === "error") {
            // Handle critical errors
            console.error("CRITICAL:", logEntry.message);
        }
    });

    runner.on("shutdown", () => {
        console.log("👋 Graceful shutdown completed");
    });

    try {
        // Attempt initial connection
        const connected = await runner.checkConnection();

        if (connected) {
            // Start reading data indefinitely
            console.log("Starting continuous data reading...");
            await runner.readSerialData(3600000); // Read for 1 hour

            // Or use logSerialOutput for verbose logging
            // await runner.logSerialOutput(30000);
        } else {
            console.log("Failed to establish initial connection");
        }
    } catch (error) {
        console.error("Application error:", error);
    } finally {
        // Graceful shutdown (also happens automatically on SIGINT/SIGTERM)
        await runner.shutdown();
    }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Run the application
main().catch(console.error);
