import type { AuthFormData, TokenType } from "@iot-test-hub/shared";

export interface UserContextType {
    user: AuthFormData | undefined;
    setUser: (user: AuthFormData) => void;
    token: TokenType | undefined;
    setToken: (token: TokenType) => void;
}