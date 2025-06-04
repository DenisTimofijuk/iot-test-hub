import { useEffect, useState, useRef, useCallback } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useLoaderData } from "react-router-dom";
import type { FetchedDataType } from "../types/ReadingsData";
import type { ChartProps, ChartData, NewDataPoint } from "../types/Chart";

export function ChartV2({ newData, maxDataPoints = 100 }: ChartProps) {
    const loaderData = useLoaderData<FetchedDataType>();
    const [data, setData] = useState<ChartData[]>([]);
    const dataRef = useRef<ChartData[]>([]);

    // Format data point helper
    const formatDataPoint = useCallback((value: NewDataPoint): ChartData => {
        const date = new Date(value.timestamp);
        const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        return {
            humidity: value.humidity,
            temperature: value.temperature,
            time: formattedTime,
            originalTime: value.timestamp,
        };
    }, []);

    // Add new data point (called by socket)
    const addDataPoint = useCallback(
        (newPoint: NewDataPoint) => {
            const formattedPoint = formatDataPoint(newPoint);

            const updatedData = [
                ...dataRef.current.slice(-maxDataPoints + 1),
                formattedPoint,
            ];
            dataRef.current = updatedData;
            setData(updatedData);
        },
        [formatDataPoint, maxDataPoints]
    );

    // Initialize with loader data
    useEffect(() => {
        const parsedData: ChartData[] = loaderData.data.map((value) =>
            formatDataPoint(value)
        );
        const trimmedData = parsedData.slice(-maxDataPoints);
        setData(trimmedData);
        dataRef.current = trimmedData;
    }, [loaderData.data, formatDataPoint, maxDataPoints]);

    // Register socket callback
    useEffect(() => {
        if (newData) {
            addDataPoint(newData);
        }
    }, [newData, addDataPoint]);

    // Custom tooltip to show original timestamp
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="text-sm font-medium">{`Time: ${dataPoint.originalTime}`}</p>
                    <p className="text-sm" style={{ color: "#8884d8" }}>
                        {`Temperature: ${
                            payload.find(
                                (p: any) => p.dataKey === "temperature"
                            )?.value
                        }°`}
                    </p>
                    <p className="text-sm" style={{ color: "#82ca9d" }}>
                        {`Humidity: ${
                            payload.find((p: any) => p.dataKey === "humidity")
                                ?.value
                        }%`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval={Math.max(0, Math.ceil(data.length / 8))} // Dynamic interval
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false} // Disable animation for real-time
                />
                <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false} // Disable animation for real-time
                />
            </LineChart>
        </ResponsiveContainer>
    );
}