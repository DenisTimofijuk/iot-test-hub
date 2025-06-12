import { useState, useEffect } from "react";
import { Clock, AlertTriangle, X } from "lucide-react";

type TokenExpiryModalOption = {
    isOpen: boolean;
    onExtend: () => void;
    onLogout: () => void;
    onClose: () => void;
    timeRemaining: number;
};

export function TokenExpiryModal({
    isOpen,
    onExtend,
    onLogout,
    onClose,
    timeRemaining = 300, // seconds until expiry (5 minutes default)
}: TokenExpiryModalOption) {
    const [countdown, setCountdown] = useState(timeRemaining);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // Auto logout when countdown reaches 0
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onLogout]);

    // Reset countdown when modal opens
    useEffect(() => {
        if (isOpen) {
            setCountdown(timeRemaining);
        }
    }, [isOpen, timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-amber-950/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Session Expiring Soon
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-gray-600 mb-4">
                            Your session will expire in:
                        </p>
                        <div className="text-3xl font-bold text-red-500 mb-4">
                            {formatTime(countdown)}
                        </div>
                        <p className="text-sm text-gray-500">
                            Would you like to extend your session to continue
                            working?
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                                countdown > 60
                                    ? "bg-green-500"
                                    : countdown > 30
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                                width: `${(countdown / timeRemaining) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                    <button
                        onClick={onExtend}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Extend Session
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Logout Now
                    </button>
                </div>
            </div>
        </div>
    );
}
