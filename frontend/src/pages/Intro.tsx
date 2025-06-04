import { Link } from "react-router-dom";

export function DataFlow() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Hardware Component */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-md">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🔧</span>
                    <h2 className="text-xl font-semibold text-blue-800">
                        Arduino ESP8266
                    </h2>
                </div>
                <div className="text-gray-700 mb-4 leading-relaxed">
                    Microcontroller with integrated sensors collecting
                    environmental data
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        DHT Sensor
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        CCS811 Sensor
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        WiFi Enabled
                    </span>
                </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex flex-col items-center mb-6 text-gray-100">
                <span className="text-3xl mb-2">↓</span>
                <span className="text-sm font-medium">
                    Serial/USB Communication
                </span>
            </div>

            {/* API Server Component */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 shadow-md">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">⚙️</span>
                    <h2 className="text-xl font-semibold text-green-800">
                        Node.js API Server
                    </h2>
                </div>
                <div className="text-gray-700 mb-4 leading-relaxed">
                    Backend server handling data processing, validation, and
                    database operations
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Express.js
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        REST API
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Middleware
                    </span>
                </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex flex-col items-center mb-6 text-gray-100">
                <span className="text-3xl mb-2">↓</span>
                <span className="text-sm font-medium">Database Operations</span>
            </div>

            {/* Database Component */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6 shadow-md">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🗄️</span>
                    <h2 className="text-xl font-semibold text-yellow-800">
                        MongoDB Database
                    </h2>
                </div>
                <div className="text-gray-700 mb-4 leading-relaxed">
                    NoSQL database storing sensor readings, timestamps, and
                    historical data
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Document Store
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Scalable
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        JSON-like
                    </span>
                </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex flex-col items-center mb-6 text-gray-100">
                <span className="text-3xl mb-2">↓</span>
                <span className="text-sm font-medium">REST API Endpoints</span>
            </div>

            {/* Frontend Component */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">📊</span>
                    <h2 className="text-xl font-semibold text-purple-800">
                        <Link
                            to="/dashboard"
                            className="hover:text-purple-600 transition-colors duration-200 underline"
                        >
                            React Frontend Dashboard
                        </Link>
                    </h2>
                </div>
                <div className="text-gray-700 mb-4 leading-relaxed">
                    Interactive web application displaying real-time sensor data
                    and analytics
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        React.js
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Charts
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Real-time UI
                    </span>
                </div>
            </div>
        </div>
    );
}
