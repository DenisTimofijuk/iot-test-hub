import { Chart } from "../components/Chart";
import ConnectionStatus from "../components/ConnectionStatus";
import type { FetchedDataType } from "../types/ReadingsData";
import { fetchDataFromDB } from "../util/fetchItems";

export function Dashboard() {
    return (
        <>
            <ConnectionStatus />
            <Chart />
        </>
    );
}

export async function dashboardDataLoader() {
    try {
        const result = await fetchDataFromDB<FetchedDataType>(
            "/api/devices/readings?limit=100"
        );
        return result;
    } catch (error) {
        throw {
            message:
                "Could not fetch data. Check if Backend services are up and running.",
        };
    }
}