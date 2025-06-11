import { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../components/userContext";
import { useAuthSubmit } from "./useAuthSubmit";
import { useNavigate } from "react-router-dom";

export function useTokenExpiry() {
    const navigate = useNavigate();
    const { token, user, setToken, setUser } = useContext(UserContext);
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const { submitHandler } = useAuthSubmit();

    const logout = useCallback(() => {
        setShowExpiryModal(false);
        setToken({ expiresAt: "", token: "", ttlMs: 0, ttlSeconds: 0 });
        setUser({ confirmPassword: "", email: "", password: "", username: "" });
        navigate('/logout');
    }, []);

    useEffect(() => {
        if (!token || !token.token) return;

        let interval: NodeJS.Timeout;

        try {
            const expiryTime = new Date(token.expiresAt).getTime();
            const warningTime = 5 * 60 * 1000; // 5 minutes

            const checkExpiry = () => {
                const now = Date.now();
                const timeLeft = expiryTime - now;

                if (
                    timeLeft <= warningTime &&
                    timeLeft > 0 &&
                    !showExpiryModal
                ) {
                    setTimeRemaining(Math.floor(timeLeft / 1000));
                    setShowExpiryModal(true);
                } else if (timeLeft <= 0) {
                    logout();
                }
            };

            checkExpiry();
            interval = setInterval(checkExpiry, 1000);
        } catch (error) {
            console.error("Error parsing token:", error);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [token, showExpiryModal, logout]);

    const extendSession = async () => {
        try {
            if (!user) {
                console.error("missing user data in context");
                throw { message: "missing user data in context" };
            }
            await submitHandler("/api/auth/login", user);
            setShowExpiryModal(false);
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
        }
    };

    const close = () => {
        setShowExpiryModal(false);
    };

    return {
        showExpiryModal,
        timeRemaining,
        extendSession,
        logout,
        close,
    };
}
