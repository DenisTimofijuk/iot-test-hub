import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ConnectionStatus } from "../types/SocketServer";

const app = express();
const httpServer = createServer(app);

let deviceConnectionStatus = "disconnected";

export function setArduinoConnectionStatus(value: string) {
    deviceConnectionStatus = value;
}

export const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:3000", // Allow API server
            "http://localhost:5173", // Allow Vite server
        ],
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.SOCKET_PORT || 4000;

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.emit("arduino-status", <ConnectionStatus>{ status: deviceConnectionStatus });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const server = httpServer.listen(PORT, () => {
    const host = `http://localhost:${PORT}`;
    console.log("\x1b[1m\x1b[35m  Socket server running!\x1b[0m");
    console.log(`\x1b[1m\x1b[35m  ➜  Local:\x1b[0m`, `\x1b[95m${host}\x1b[0m`);
});

process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Socket server shut down gracefully");
    });
});
