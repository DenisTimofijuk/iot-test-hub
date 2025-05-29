import { useState } from "react";

export default function useRequestHandler<T, P = void>() {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This function now returns a function that can be called manually
    async function executeRequest (fetchFn: (params?: P) => Promise<T>, params?: P) {
        try {
            setIsLoading(true);
            setError(null);
            const result = await fetchFn(params);
            setData(result);
            return result; // Return the result so the component can use it directly
        } catch (err: any) {
            setError(err.message || "An error occurred");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, executeRequest };
}