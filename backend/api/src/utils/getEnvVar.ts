import { EnvVars } from "../types/EnvVars";

export function getEnvVar(name: keyof EnvVars, defaultValue?: string): string {
    const value = process.env[name] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}
