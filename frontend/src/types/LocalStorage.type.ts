export const StorageKeys = {
    Token: "token",
    expiresAt: "expiration-date"
} as const;

export type StorageKey = keyof typeof StorageKeys;
