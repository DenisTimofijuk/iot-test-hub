import { AlertCircle, RefreshCw, Home, WifiOff } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";
import { RootHeader } from "../components/Header";

const ErrorPage = ({
    title = "System Error",
    message = "An unexpected error occurred in the environmental monitoring system.",
    errorCode = "500",
    showRetry = true,
    onRetry = () => window.location.reload()
}) => {
    const navigate = useNavigate();
    const onHome = () => navigate("/");

    const error: any = useRouteError();
    if (error.message) {
        message = error.message;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-10">
            <RootHeader></RootHeader>
            <main>
                <div className=" flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        {/* Main Error Container */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center relative overflow-hidden">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl"></div>

                            <div className="relative z-10">
                                {/* Error Icon and Illustration */}
                                <div className="mb-6 relative">
                                    {/* Custom IoT Error SVG */}
                                    <svg
                                        className="mx-auto mb-4 w-24 h-24 text-red-400"
                                        viewBox="0 0 100 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {/* Device Base */}
                                        <rect
                                            x="30"
                                            y="40"
                                            width="40"
                                            height="30"
                                            rx="4"
                                            fill="currentColor"
                                            opacity="0.8"
                                        />
                                        {/* Screen */}
                                        <rect
                                            x="35"
                                            y="45"
                                            width="30"
                                            height="15"
                                            rx="2"
                                            fill="#1e293b"
                                        />
                                        {/* Error X */}
                                        <path
                                            d="M42 50 L58 58 M58 50 L42 58"
                                            stroke="#ef4444"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        {/* Antenna */}
                                        <line
                                            x1="50"
                                            y1="40"
                                            x2="50"
                                            y2="25"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx="50"
                                            cy="22"
                                            r="3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        {/* Warning signals */}
                                        <circle
                                            cx="50"
                                            cy="22"
                                            r="8"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="1.5"
                                            opacity="0.6"
                                        >
                                            <animate
                                                attributeName="r"
                                                values="8;12;8"
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="opacity"
                                                values="0.6;0.2;0.6"
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                        <circle
                                            cx="50"
                                            cy="22"
                                            r="12"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="1"
                                            opacity="0.4"
                                        >
                                            <animate
                                                attributeName="r"
                                                values="12;16;12"
                                                dur="2s"
                                                repeatCount="indefinite"
                                                begin="0.5s"
                                            />
                                            <animate
                                                attributeName="opacity"
                                                values="0.4;0.1;0.4"
                                                dur="2s"
                                                repeatCount="indefinite"
                                                begin="0.5s"
                                            />
                                        </circle>
                                    </svg>

                                    {/* Error Code Badge */}
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {errorCode}
                                    </div>
                                </div>

                                {/* Error Title */}
                                <h1 className="text-2xl font-bold text-white mb-3">
                                    {title}
                                </h1>

                                {/* Error Message */}
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    {message}
                                </p>

                                {/* Status Indicators */}
                                <div className="flex justify-center space-x-4 mb-8">
                                    <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                                        <WifiOff className="w-4 h-4 text-red-400" />
                                        <span className="text-xs text-slate-300">
                                            Connection Lost
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                                        <AlertCircle className="w-4 h-4 text-amber-400" />
                                        <span className="text-xs text-slate-300">
                                            System Alert
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {showRetry && (
                                        <button
                                            onClick={onRetry}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                                        >
                                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                            <span>Retry Connection</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={onHome}
                                        className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span>Return to Home</span>
                                    </button>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <p className="text-xs text-slate-400">
                                        IoT Environmental Monitoring System
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Error logged at{" "}
                                        {new Date().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ErrorPage;
