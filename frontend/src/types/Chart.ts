export type ChartData = {
    time: string;
    originalTime: string;
    temperature: number;
    humidity: number;
};

export type NewDataPoint = {
    timestamp: string;
    temperature: number;
    humidity: number;
};

export type ChartProps = {
    maxDataPoints?: number;
    newData: SensorDataType | null;
};

export type SensorDataType = {
    co2: number;
    humidity: number;
    temperature: number;
    timestamp: string;
};

export type SocketResponse = {
    data: SensorDataType;
};
