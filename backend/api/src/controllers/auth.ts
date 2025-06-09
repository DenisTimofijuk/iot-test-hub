import { Request, Response } from "express";
import { createToken } from "../utils/authentication";

export function loginHandler(req: Request, res: Response) {
    const { username, password } = req.body;

    // TODO: replace with actual user lookup
    if (username === "admin" && password === "password") {
        const token = createToken();
        res.json({ token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
}