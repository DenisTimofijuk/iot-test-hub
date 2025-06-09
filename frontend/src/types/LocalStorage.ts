export const StorageKeys = {
    Token: "token"
} as const;

export type StorageKey = keyof typeof StorageKeys;
