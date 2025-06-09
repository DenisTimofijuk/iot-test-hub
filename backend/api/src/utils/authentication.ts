import { sign } from "jsonwebtoken";
import config from "../config/config";

const KEY = config.tokenKey;

export function createToken() {
    const token = sign({ userId: 1 }, KEY, { expiresIn: "1h" });

    return token;
}