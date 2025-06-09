import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function RootHeader() {
    return (
        <>
            <Link className="flex flex-row items-center gap-1" to="/home"><Home className="w-4 h-4" />Home</Link>
            <h1 className="text-4xl font-bold text-center mb-12">
                🌐 IoT Environmental Monitoring & Testing System
            </h1>
        </>
    );
}
