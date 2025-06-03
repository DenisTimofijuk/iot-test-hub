import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function ConnectionStatus () {
    const [connectionStatus, setConnectionStatus] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        // Listen for Arduino status updates
        newSocket.on("arduino-status", (data) => {
            setConnectionStatus(data.status);
        });

        // Handle socket connection events
        newSocket.on("connect", () => {
            console.log("Connected to server");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
            setConnectionStatus('disconnected.');
        });

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <div>Arduino Device - {connectionStatus}</div>
    );
};
