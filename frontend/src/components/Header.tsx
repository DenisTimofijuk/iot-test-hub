import { Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../util/auth";

export function RootHeader() {
    const loginflag = isLoggedIn();

    return (
        <>
            <nav className="flex justify-between items-center">
                {/* Left side - Home link */}
                <Link
                    className="flex items-center gap-2 px-4 py-2 hover:text-blue-900 hover:bg-white/50 rounded-lg transition-all duration-200 font-medium"
                    to="/home"
                >
                    <Home className="w-5 h-5" />
                    Home
                </Link>

                {/* Right side - Logout link */}
                {loginflag && (
                    <Link
                        className="flex items-center gap-2 px-4 py-2 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-red-200 hover:border-red-300"
                        to="/logout"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                )}
            </nav>

            <h1 className="text-4xl font-bold text-center mb-12">
                🌐 IoT Environmental Monitoring & Testing System
            </h1>
        </>
    );
}
