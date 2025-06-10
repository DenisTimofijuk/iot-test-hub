import ESP8266Runner from "./ESP8266Runner";
import { SerialOutput } from "./types/SerialOutput";
import { io, setArduinoConnectionStatus } from "./socket-server/server";
import { ConnectrionStatus } from "./types/SocketServer";
import { sendData } from "./db/sendData";
import { loginUser } from "./db/login";

async function main() {
    const runner = new ESP8266Runner("/dev/ttyUSB0"); // Adjust port as needed

    // Set up event listeners
    runner.on("connected", () => {
        const message = "🟢 Device connected successfully";
        console.log(message);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
    });

    runner.on("connectionFailed", (error) => {
        const message = "🔴 Connection failed: " + error.message;
        console.log(message);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
    });

    runner.on("connectionLost", () => {
        const message = "🟡 Connection lost, attempting to reconnect...";
        console.log(message);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
    });

    runner.on("reconnectFailed", () => {
        const message = "🔴 All reconnect attempts failed";
        console.log(message);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
    });

    runner.on("sensorData", async (data: SerialOutput) => {
        console.log("📊 Sensor data received. Saving to Database...");
        try {
            const dataToSend = {
                temperature: data.dht22.temperature,
                humidity: data.dht22.humidity,
                co2: data.ccs811.co2,
                timestamp: new Date().toISOString(),
            };

            io.emit("arduino-data", { data: dataToSend });
            await sendData(dataToSend);

            console.log("Data successfully saved to database.");
        } catch (error) {
            console.error("Failed to save data to database:", error);
        }
    });

    runner.on("deviceError", (error) => {
        const message = "⚠️  Device error.";
        console.log("⚠️  Device error:", error);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
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
        const message = "👋 Graceful shutdown completed";
        console.log(message);
        io.emit("arduino-status", <ConnectrionStatus>{ status: message });
        setArduinoConnectionStatus(message);
    });

    try {
        // login user to be able to save data to database
        await loginUser();
        
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

/**
 * TODO: WHEN CONNECTION LOST
 * CLEAR EVERYTHING INCLOODING TIMERS
 * ON RECONNECT INITIATE NEW SERIAL READING
 */

/**
 * recursive function:
 * start readings, await to finish, then recursive call
 * if reconnects - call same function (cancel and clear everything before that)
 * global variables to track progress if needed.
 */