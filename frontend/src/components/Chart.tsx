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
    temperature: number;
    humidity: number;
};

export function Chart() {
    const loaderData = useLoaderData<FetchedDataType>();
    const [data, setData] = useState<ChartData[]>([]);
    useEffect(() => {
        const parsedData: ChartData[] = loaderData.data.map((value) => {
            return {
                humidity: value.humidity,
                temperature: value.temperature,
                time: value.createdAt
            } as ChartData;
        });

        setData(parsedData);
    }, [loaderData.data]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}