import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const KEY = config.tokenKey;

export function createToken(userId: string) {
    const token = sign({ userId }, KEY, { expiresIn: "1h" });

    return token;
}
