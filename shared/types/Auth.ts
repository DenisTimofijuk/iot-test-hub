export type TokenType = {
    token: string;
    expiresAt: string;
    ttlMs: number;
    ttlSeconds: number;
};

export type UserType = {
    id: string;
    username: string;
    email: string;
};

export type AuthResponse = {
    message?: string;
    token: TokenType;
    user: UserType;
};

export type AuthFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
};
