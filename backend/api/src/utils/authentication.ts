import { sign, decode } from "jsonwebtoken";
import { config } from "../config/config";
import { TokenType } from "@iot-test-hub/shared";

const KEY = config.tokenKey;

export function createToken(userId: string): TokenType {
    const token = sign({ userId }, KEY, { expiresIn: "1h" });
    
    // Decode to get expiration info
    const decoded = decode(token) as any;
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const ttl = expiresAt - Date.now(); // Time remaining in milliseconds
    
    return {
        token,
        expiresAt: new Date(expiresAt).toISOString(),
        ttlMs: ttl,
        ttlSeconds: Math.floor(ttl / 1000)
    };
}