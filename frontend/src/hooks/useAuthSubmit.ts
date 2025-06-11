import type { AuthFormData, AuthResponse } from "@iot-test-hub/shared";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/userContext";
import { StorageKeys } from "../types/LocalStorage.type";

export function useAuthSubmit() {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");

    async function handler(url: string, formData: AuthFormData) {
        const defaultErrorMessage = "Failed to sign in.";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result: AuthResponse = await response.json();

            if (!response.ok) {
                if ("message" in result) {
                    throw new Error(result.message || defaultErrorMessage);
                } else {
                    throw new Error(defaultErrorMessage);
                }
            }

            userCtx.setToken(result.token);
            userCtx.setUser(formData);
            localStorage.setItem(StorageKeys.Token, result.token.token);
            localStorage.setItem(StorageKeys.expiresAt, result.token.expiresAt);
            navigate("/home");
        } catch (error: any) {
            setErrorMessage(error.message || defaultErrorMessage);
        }
    }

    return { errorMessage, submitHandler: handler };
}
