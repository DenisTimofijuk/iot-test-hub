import { EventEmitter } from 'events';
import { ESP8266SerialManager } from './serialManager';
import { SerialOutput } from './types/SerialOutput';

interface ConnectionStatus {
    isConnected: boolean;
    lastSeen: number;
    reconnectAttempts: number;
}

export default class ESP8266Runner extends EventEmitter {
    private serialManager: ESP8266SerialManager;
    private messageBuffer: string = '';
    private connectionStatus: ConnectionStatus = {
        isConnected: false,
        lastSeen: 0,
        reconnectAttempts: 0
    };
    private reconnectTimer?: NodeJS.Timeout;
    private heartbeatTimer?: NodeJS.Timeout;
    private isShuttingDown: boolean = false;
    
    // Configuration
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly RECONNECT_DELAY = 3000;
    private readonly HEARTBEAT_INTERVAL = 30000;
    private readonly CONNECTION_TIMEOUT = 10000;

    constructor(private portPath: string) {
        super();
        this.serialManager = new ESP8266SerialManager(portPath);
        this.setupGracefulShutdown();
    }

    async checkConnection(): Promise<boolean> {
        this.logInfo("Connecting...");
        try {
            await this.serialManager.connect();
            this.connectionStatus.isConnected = true;
            this.connectionStatus.lastSeen = Date.now();
            this.connectionStatus.reconnectAttempts = 0;
            this.logInfo("✓ Connection successful");
            this.startHeartbeat();
            this.emit('connected');
            return true;
        } catch (error) {
            this.logError("✗ Connection failed:", error);
            this.connectionStatus.isConnected = false;
            this.emit('connectionFailed', error);
            return false;
        }
    }

    // JSON data parsing with buffer management
    private parseIncomingData(rawData: string): void {
        try {
            // Add new data to buffer
            this.messageBuffer += rawData;
            
            // Try to extract complete JSON objects or newline-delimited messages
            this.extractCompleteMessages();
            
        } catch (error) {
            this.logError('Error processing incoming data:', error);
        }
    }

    private extractCompleteMessages(): void {
        let processedAny = true;
        
        while (processedAny && this.messageBuffer.length > 0) {
            processedAny = false;
            
            // Try to extract complete JSON objects
            if (this.messageBuffer.includes('{')) {
                const startIndex = this.messageBuffer.indexOf('{');
                if (startIndex >= 0) {
                    let braceCount = 0;
                    let endIndex = -1;
                    
                    // Find matching closing brace
                    for (let i = startIndex; i < this.messageBuffer.length; i++) {
                        if (this.messageBuffer[i] === '{') braceCount++;
                        if (this.messageBuffer[i] === '}') braceCount--;
                        
                        if (braceCount === 0) {
                            endIndex = i;
                            break;
                        }
                    }
                    
                    // If we found a complete JSON object
                    if (endIndex >= 0) {
                        const jsonMessage = this.messageBuffer.substring(startIndex, endIndex + 1);
                        this.processMessage(jsonMessage);
                        
                        // Remove processed message from buffer
                        this.messageBuffer = this.messageBuffer.substring(endIndex + 1);
                        processedAny = true;
                        continue;
                    }
                }
            }
            
            // Try to extract newline-delimited messages
            if (this.messageBuffer.includes('\n')) {
                const messages = this.messageBuffer.split('\n');
                
                // Keep the last incomplete message in buffer
                this.messageBuffer = messages.pop() || '';
                
                // Process complete messages
                messages.forEach(message => {
                    const trimmedMessage = message.trim();
                    if (trimmedMessage && !trimmedMessage.startsWith('{')) {
                        this.processMessage(trimmedMessage);
                    }
                });
                
                if (messages.length > 0) {
                    processedAny = true;
                }
            }
            
            // Prevent infinite buffer growth - clear if too large and no valid data found
            if (this.messageBuffer.length > 10000 && !processedAny) {
                this.logWarning('Buffer too large, clearing potentially corrupted data');
                this.messageBuffer = '';
                break;
            }
        }
    }

    private processMessage(message: string): void {
        try {
            // Update last seen timestamp
            this.connectionStatus.lastSeen = Date.now();
            
            // Try to parse as JSON first
            if (message.startsWith('{') && message.endsWith('}')) {
                try {
                    const jsonData: SerialOutput = JSON.parse(message);
                    this.logInfo('Parsed JSON data:', jsonData);
                    this.emit('sensorData', jsonData);
                    return;
                } catch (jsonError) {
                    this.logWarning('Failed to parse JSON, treating as plain text:', message);
                }
            }
            
            // Handle error messages
            if (message.toLowerCase().includes('error')) {
                this.logError('Device error:', message);
                this.emit('deviceError', message);
                return;
            }
            
            // Handle other messages
            this.logInfo('Received message:', message);
            this.emit('rawMessage', message);
            
        } catch (error) {
            this.logError('Error processing message:', error);
        }
    }

    // Connection monitoring and auto-reconnect
    private startHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }
        
        this.heartbeatTimer = setInterval(() => {
            if (this.isShuttingDown) return;
            
            const timeSinceLastSeen = Date.now() - this.connectionStatus.lastSeen;
            
            if (timeSinceLastSeen > this.CONNECTION_TIMEOUT) {
                this.logWarning('Connection timeout detected');
                this.connectionStatus.isConnected = false;
                this.emit('connectionLost');
                this.attemptReconnect();
            }
        }, this.HEARTBEAT_INTERVAL);
    }

    private async attemptReconnect(): Promise<void> {
        if (this.isShuttingDown || this.reconnectTimer) return;
        
        if (this.connectionStatus.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            this.logError(`Max reconnect attempts (${this.MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
            this.emit('reconnectFailed');
            return;
        }
        
        this.connectionStatus.reconnectAttempts++;
        this.logInfo(`Attempting reconnect ${this.connectionStatus.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}...`);
        
        this.reconnectTimer = setTimeout(async () => {
            this.reconnectTimer = undefined;
            
            try {
                await this.serialManager.disconnect();
            } catch (error) {
                this.logWarning('Error during disconnect:', error);
            }
            
            const success = await this.checkConnection();
            if (!success && !this.isShuttingDown) {
                this.attemptReconnect();
            }
        }, this.RECONNECT_DELAY);
    }

    async readSerialData(duration = 20000): Promise<void> {
        const durationInSeconds = Math.round(duration / 1000);
        this.logInfo(`Reading serial for ${durationInSeconds}s...`);

        if (!this.connectionStatus.isConnected) {
            const connected = await this.checkConnection();
            if (!connected) {
                throw new Error('Cannot start reading: connection failed');
            }
        }

        // Set up data handler with buffer management
        this.serialManager.onSensorData((data: string) => {
            this.parseIncomingData(data);
        });

        await new Promise((resolve) => setTimeout(resolve, duration));
        this.logInfo('Serial reading finished.');
    }

    async logSerialOutput(duration = 20000): Promise<void> {
        this.logInfo("Displaying Serial output:");

        // Listen to processed data events
        const dataHandler = (data: SerialOutput | string) => {
            if (typeof data === 'object') {
                this.logInfo(`Parsed sensor data:`, data);
            } else {
                this.logInfo(`Raw message: ${data}`);
            }
        };

        this.on('sensorData', dataHandler);
        this.on('rawMessage', dataHandler);

        await this.readSerialData(duration);

        // Clean up listeners
        this.off('sensorData', dataHandler);
        this.off('rawMessage', dataHandler);
    }

    // Error logging system
    private logInfo(message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [INFO] ${message}`;
        console.log(logMessage, data ? data : '');
        this.emit('log', { level: 'info', message, data, timestamp });
    }

    private logWarning(message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [WARN] ${message}`;
        console.warn(logMessage, data ? data : '');
        this.emit('log', { level: 'warning', message, data, timestamp });
    }

    private logError(message: string, error?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [ERROR] ${message}`;
        console.error(logMessage, error ? error : '');
        this.emit('log', { level: 'error', message, error, timestamp });
    }

    // Graceful shutdown handling
    private setupGracefulShutdown(): void {
        const shutdownHandler = async (signal: string) => {
            if (this.isShuttingDown) return;
            
            this.logInfo(`Received ${signal}, shutting down gracefully...`);
            await this.shutdown();
            process.exit(0);
        };

        process.on('SIGINT', () => shutdownHandler('SIGINT'));
        process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
        process.on('SIGQUIT', () => shutdownHandler('SIGQUIT'));
    }

    async shutdown(): Promise<void> {
        if (this.isShuttingDown) return;
        
        this.isShuttingDown = true;
        this.logInfo('Starting graceful shutdown...');
        
        try {
            // Clear timers
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = undefined;
            }
            
            if (this.heartbeatTimer) {
                clearInterval(this.heartbeatTimer);
                this.heartbeatTimer = undefined;
            }
            
            // Disconnect from serial
            if (this.connectionStatus.isConnected) {
                await this.serialManager.disconnect();
                this.connectionStatus.isConnected = false;
            }
            
            // Clear message buffer
            this.messageBuffer = '';
            
            this.logInfo('Graceful shutdown completed');
            this.emit('shutdown');
            
        } catch (error) {
            this.logError('Error during shutdown:', error);
        }
    }

    // Public getters for status
    get isConnected(): boolean {
        return this.connectionStatus.isConnected;
    }

    get reconnectAttempts(): number {
        return this.connectionStatus.reconnectAttempts;
    }

    get lastSeen(): number {
        return this.connectionStatus.lastSeen;
    }

    // Manual reconnect trigger
    async forceReconnect(): Promise<boolean> {
        this.logInfo('Manual reconnect triggered');
        this.connectionStatus.reconnectAttempts = 0;
        
        try {
            await this.serialManager.disconnect();
        } catch (error) {
            this.logWarning('Error during disconnect:', error);
        }
        
        return await this.checkConnection();
    }

    // Clear buffer manually if needed
    clearBuffer(): void {
        this.messageBuffer = '';
        this.logInfo('Message buffer cleared');
    }
}