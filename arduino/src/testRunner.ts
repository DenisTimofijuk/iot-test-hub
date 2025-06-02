// src/testRunner.ts
import { ESP8266SerialManager } from "./serialManager";

export class ESP8266TestRunner {
    private serialManager: ESP8266SerialManager;
    private testResults: any[] = [];

    constructor(portPath: string) {
        this.serialManager = new ESP8266SerialManager(portPath);
    }

    async logSerialOutput(duration = 20000) {
        console.log("Displaying Serial output:");

        this.serialManager.onSensorData((data) => {
            console.log(`Sensor reading: ${data}`);
        });

        await new Promise((resolve) => setTimeout(resolve, duration));
    }

    async runBasicConnectivityTest(): Promise<boolean> {
        console.log("Testing basic connectivity...");
        try {
            await this.serialManager.connect();
            console.log("✓ Connection successful");
            return true;
        } catch (error) {
            console.error("✗ Connection failed:", error);
            return false;
        }
    }

    async runBufferStressTest(): Promise<void> {
        console.log("Testing buffer management under load...");

        // Send rapid commands to test buffer handling
        for (let i = 0; i < 100; i++) {
            await this.serialManager.sendCommand(`TEST_${i}`);
            if (i % 10 === 0) {
                const stats = this.serialManager.getBufferStats();
                console.log(
                    `Buffer stats: ${stats.totalBytes} bytes, ${stats.chunks} chunks`
                );
            }
        }

        console.log("✓ Buffer stress test completed");
    }

    getTestResults(): any[] {
        return this.testResults;
    }

    async cleanup(): Promise<void> {
        await this.serialManager.disconnect();
    }
}
