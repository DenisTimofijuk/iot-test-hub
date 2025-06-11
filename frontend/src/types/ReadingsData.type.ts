export type Reading = {
    co2: number;
    createdAt: string;
    humidity: number;
    temperature: number;
    timestamp: string;
    _id: string;
};

export type FetchedDataType = {
    count: number;
    data: Reading[];
    success: boolean;
    total: number;
};
