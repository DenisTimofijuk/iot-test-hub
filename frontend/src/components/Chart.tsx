import { useEffect, useState } from "react";
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

type ChartData = {
    time: string;
    originalTime: string; // Keep original for tooltip
    temperature: number;
    humidity: number;
};

export function Chart() {
    const loaderData = useLoaderData<FetchedDataType>();
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const sortedData = loaderData.data.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        const parsedData: ChartData[] = sortedData.map((value, _) => {
            // Format the time for better display
            const date = new Date(value.createdAt);
            const formattedTime = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });

            return {
                humidity: value.humidity,
                temperature: value.temperature,
                time: formattedTime,
                originalTime: value.createdAt,
            } as ChartData;
        });

        setData(parsedData);
    }, [loaderData.data]);

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

    console.log(`Total data points: ${data.length}`);

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
                    interval={Math.ceil(data.length / 10)} // Show roughly 10 labels max
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
                    dot={false} // Remove dots for better performance with many points
                    activeDot={{ r: 4 }} // Only show dot on hover
                />
                <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
