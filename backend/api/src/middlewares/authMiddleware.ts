import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/config";

const KEY = config.tokenKey;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    verify(token, KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }
        // Optionally attach user info to request
        (req as any).user = user;
        next();
    });
}
