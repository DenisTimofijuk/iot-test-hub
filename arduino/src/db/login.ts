import { AuthResponse } from "@iot-test-hub/shared";
import { config } from "../config/config";
import axios from "axios";

// Token will live only for 1 hour according current database settings
// TODO: handle this
let TOKEN: string | null = null;

const RETRY_CONFIG = {
    maxAttempts: 5,
    delayMs: 3000,
};

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptLogin(): Promise<string> {
    const requestData = {
        password: config.password,
        username: config.userName,
    };

    const requestConfig = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        requestData,
        requestConfig
    );

    const result: AuthResponse = response.data;

    return result.token.token;
}

export async function loginUser(): Promise<void> {
    for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
        try {
            TOKEN = await attemptLogin();
            console.log("Login successful");
            return;
        } catch (error) {
            const isLastAttempt = attempt === RETRY_CONFIG.maxAttempts;

            if (isLastAttempt) {
                // Handle final failure
                if (axios.isAxiosError(error) && error.response) {
                    const errorMessage =
                        error.response.data?.message || "Login error.";
                    throw new Error(
                        `Login failed after ${RETRY_CONFIG.maxAttempts} attempts: ${errorMessage}`
                    );
                } else {
                    throw new Error(
                        `Network error or login failed after ${RETRY_CONFIG.maxAttempts} attempts.`
                    );
                }
            } else {
                // Log retry attempt
                const remainingAttempts = RETRY_CONFIG.maxAttempts - attempt;
                console.log(
                    `Login failed. Retrying in ${RETRY_CONFIG.delayMs}ms. Attempts remaining: ${remainingAttempts}`
                );

                // Wait before next attempt
                await delay(RETRY_CONFIG.delayMs);
            }
        }
    }
}

// Helper function to get the stored token
export function getToken(): string | null {
    return TOKEN;
}

// Helper function to clear the token (useful for logout)
export function clearToken(): void {
    TOKEN = null;
}
