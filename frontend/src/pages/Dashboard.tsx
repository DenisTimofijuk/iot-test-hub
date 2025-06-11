import { ChartV2 } from "../components/Chart.v2";
import ConnectionStatus from "../components/ConnectionStatus";
import type { SocketResponse } from "../types/Chart.type";
import type { FetchedDataType } from "../types/ReadingsData.type";
import { fetchDataFromDB } from "../util/fetchItems";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const DATA_LIMIT = 100;

const initStatus =
    "Disconnected from the server. Unable to communicate with the device.";

export function Dashboard() {
    const [connectionStatus, setConnectionStatus] = useState(initStatus);
    const [_, setSocket] = useState<Socket | null>(null);
    const [sensorData, setSensorData] = useState<SocketResponse | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        // Listen for Arduino status updates
        newSocket.on("arduino-status", (data) => {
            setConnectionStatus(data.status);
        });

        // Listen for Arduino data updates
        newSocket.on("arduino-data", (data) => {
            setSensorData(data);
        });

        // Handle socket connection events
        newSocket.on("connect", () => {
            console.log("Connected to server");
            setConnectionStatus(
                "Connected to the server and waiting for the device status."
            );
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
            setConnectionStatus(initStatus);
        });

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <>
            <ConnectionStatus status={connectionStatus} />
            <ChartV2
                newData={sensorData && sensorData.data}
                maxDataPoints={DATA_LIMIT}
            />
        </>
    );
}

export async function dashboardDataLoader() {
    try {
        const result = await fetchDataFromDB<FetchedDataType>(
            `/api/devices/readings?limit=${DATA_LIMIT}`
        );
        return result;
    } catch (error: any) {
        throw {
            message: error.message || 
                "Could not fetch data. Check if Backend services are up and running.",
            status: error.status || 500,
        };
    }
}
