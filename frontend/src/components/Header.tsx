import { Link } from "react-router-dom";

export function RootHeader() {
    return (
        <>
            <Link to="/">Home</Link>
            <h1 className="text-4xl font-bold text-center mb-12">
                🌐 IoT Data Flow Architecture
            </h1>
        </>
    );
}
