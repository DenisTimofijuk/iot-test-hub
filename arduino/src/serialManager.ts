import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export class ESP8266SerialManager {
    private port: SerialPort | null = null;
    private parser: ReadlineParser | null = null;
    private isConnected = false;
    private dataBuffer: Buffer[] = [];

    constructor(private portPath: string, private baudRate: number = 115200) {}

    async connect(): Promise<void> {
        try {
            this.port = new SerialPort({
                path: this.portPath,
                baudRate: this.baudRate,
                dataBits: 8,
                parity: "none",
                stopBits: 1,
            });

            this.parser = this.port.pipe(
                new ReadlineParser({ delimiter: "\n" })
            );

            this.port.on("open", () => {
                console.log(`Connected to ESP8266 on ${this.portPath}`);
                this.isConnected = true;
            });

            this.port.on("error", (err) => {
                console.error("Serial port error:", err);
                this.isConnected = false;
            });

            this.port.on("close", () => {
                console.log("Serial port closed");
                this.isConnected = false;
            });

            // Handle raw data for buffer management examples
            this.port.on("data", (data: Buffer) => {
                this.handleRawData(data);
            });

            await this.waitForConnection();
        } catch (error) {
            throw new Error(`Failed to connect: ${error}`);
        }
    }

    private handleRawData(data: Buffer): void {
        // Example of buffer management - store chunks
        this.dataBuffer.push(data);

        // Keep only last 10 chunks to prevent memory issues
        if (this.dataBuffer.length > 10) {
            this.dataBuffer = this.dataBuffer.slice(-10);
        }
    }

    private waitForConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Connection timeout"));
            }, 5000);

            const checkConnection = () => {
                // TODO: this will continue running even after Connection timeout.
                // TODO: fix this.
                if (this.isConnected) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    setTimeout(checkConnection, 100);
                }
            };
            checkConnection();
        });
    }

    // Send commands to ESP8266
    async sendCommand(command: string): Promise<void> {
        if (!this.port || !this.isConnected) {
            throw new Error("Not connected to device");
        }

        return new Promise((resolve, reject) => {
            this.port!.write(command + "\n", (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    onSensorData(callback: (data: string) => void): void {
        if (!this.parser) return;

        this.parser.on("data", (line: string) => {
            line = line.trim();
            callback(line);
        });
    }

    // Buffer management utilities
    getBufferStats(): { totalBytes: number; chunks: number } {
        const totalBytes = this.dataBuffer.reduce(
            (sum, buf) => sum + buf.length,
            0
        );
        return {
            totalBytes,
            chunks: this.dataBuffer.length,
        };
    }

    clearBuffer(): void {
        this.dataBuffer = [];
    }

    // Get recent raw data as combined buffer
    getRawDataBuffer(): Buffer {
        return Buffer.concat(this.dataBuffer);
    }

    async disconnect(): Promise<void> {
        if (this.port) {
            await new Promise<void>((resolve) => {
                this.port!.close(() => resolve());
            });
        }
    }
}
