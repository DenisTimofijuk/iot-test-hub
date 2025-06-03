import { useContext, useEffect, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ItemContext } from "./ItemContext";

type ChartData = {
    time: string;
    temperature: number;
    humidity: number;
};

export function TemperatureChart() {
    const itemCtx = useContext(ItemContext);
    const [data, setData] = useState<ChartData[]>([]);
    useEffect(() => {
        const parsedData: ChartData[] = itemCtx.data.map((value) => {
            return {
                humidity: value.humidity,
                temperature: value.temperature,
                time: value.createdAt
            } as ChartData;
        });

        setData(parsedData);
    }, [itemCtx.data]);

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

// TODO: implement websockets
// dirplay data only for last 24h
// add indication if device is connected