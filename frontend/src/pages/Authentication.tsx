import { Lock, User, Eye, EyeOff, Wifi, Shield } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { StorageKeys } from "../types/LocalStorage";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }


    function handleLogin(){
        handleSubmit("/api/auth/login");
    }

    function handleRegister() {
        handleSubmit("/api/auth/register");
    }

    async function handleSubmit(url: string) {
        const defaultErrorMessage = "Failed to sign in.";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || defaultErrorMessage);
            }

            localStorage.setItem(StorageKeys.Token, result.token);
            navigate("/home");
        } catch (error: any) {
            setErrorMessage(error.message || defaultErrorMessage);
        }
    }

    function toggleAuthMode() {
        setIsLogin(!isLogin);
        setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
        });
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-md w-full">
                {/* Main Auth Container */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl"></div>

                    <div className="relative z-10">
                        {/* Header with IoT Icon */}
                        <div className="text-center mb-8">
                            {/* Custom IoT Authentication SVG */}
                            <svg
                                className="mx-auto mb-4 w-20 h-20 text-blue-400"
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
                                {/* Lock Icon */}
                                <rect
                                    x="47"
                                    y="50"
                                    width="6"
                                    height="6"
                                    rx="1"
                                    fill="#10b981"
                                />
                                <path
                                    d="M45 50 L45 48 Q45 46 47 46 L53 46 Q55 46 55 48 L55 50"
                                    stroke="#10b981"
                                    strokeWidth="1.5"
                                    fill="none"
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
                                {/* Connection signals */}
                                <circle
                                    cx="50"
                                    cy="22"
                                    r="8"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="1.5"
                                    opacity="0.6"
                                >
                                    <animate
                                        attributeName="r"
                                        values="8;12;8"
                                        dur="3s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="0.6;0.2;0.6"
                                        dur="3s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle
                                    cx="50"
                                    cy="22"
                                    r="12"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="1"
                                    opacity="0.4"
                                >
                                    <animate
                                        attributeName="r"
                                        values="12;16;12"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        begin="0.7s"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="0.4;0.1;0.4"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        begin="0.7s"
                                    />
                                </circle>
                            </svg>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                {isLogin ? "Welcome" : "Create Account"}
                            </h1>
                            <p className="text-slate-300 text-sm">
                                {isLogin
                                    ? "Sign in to your IoT monitoring dashboard"
                                    : "Join our IoT environmental monitoring system"}
                            </p>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex justify-center space-x-4 mb-6">
                            <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                                <Wifi className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-300">
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                                <Shield className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-slate-300">
                                    Secure
                                </span>
                            </div>
                        </div>

                        {/* Error Message - Add this right after the Status Indicators div and before the Authentication Form */}
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg backdrop-blur-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-red-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-red-200 font-medium">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Authentication Form */}
                        <div className="space-y-4">
                            {/* Email Field (only for signup)*/}
                            {!isLogin && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Confirm Password Field (only for signup) */}
                            {!isLogin && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            {/* Forgot Password Link (only for login) */}
                            {isLogin && (
                                <div className="text-right">
                                    <button
                                        type="button"
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={isLogin ? handleLogin : handleRegister}
                                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                            >
                                <Lock className="w-4 h-4" />
                                <span>
                                    {isLogin ? "Sign In" : "Create Account"}
                                </span>
                            </button>
                        </div>

                        {/* Toggle Auth Mode */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-300 text-sm">
                                {isLogin
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                                <button
                                    onClick={toggleAuthMode}
                                    className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-slate-400">
                                IoT Environmental Monitoring System
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
