export const StorageKeys = {
    Token: "token",
    expiresAt: "expiration-date",
    user: "user"
} as const;

export type StorageKey = keyof typeof StorageKeys;