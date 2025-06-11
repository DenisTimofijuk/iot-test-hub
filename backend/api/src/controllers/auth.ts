import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../utils/authentication";
import { initializeDatabase } from "../models/mongodb";
import { User } from "../types/User";
import { parseSchemaErrors } from "../utils/errorParser";
import type { AuthFormData, AuthResponse } from "@iot-test-hub/shared";

export async function registerHandler(req: Request, res: Response) {
    try {
        const { username, email, password, confirmPassword }: AuthFormData = req.body;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            res.status(400).json({
                message: "Username, email, and password are required",
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
            return;
        }

        if(confirmPassword !== password){
            res.status(400).json({
                message: "The password does not match",
            });
            return;
        }

        const database = await initializeDatabase();
        const collection = database.collection<User>("users");

        // Check if user already exists
        const existingUser = await collection.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() },
            ],
        });

        if (existingUser) {
            res.status(409).json({
                message: "User with this username or email already exists",
            });
            return;
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser: Omit<User, "_id"> = {
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password_hash: hashedPassword,
            created_at: new Date(),
            updated_at: new Date(),
            role: "user",
            active: true,
        };

        console.log(newUser);
        const result = await collection.insertOne(newUser);

        if (result.insertedId) {
            // Generate token for immediate login
            const token = createToken(result.insertedId);
            const response: AuthResponse = {
                message: "User created successfully",
                token,
                user: {
                    id: result.insertedId,
                    username: newUser.username,
                    email: newUser.email,
                },
            }
            res.status(201).json(response);
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (error: any) {
        const fullError = parseSchemaErrors(error.errInfo);
        console.log("Full validation error:", fullError)
        const message = fullError.map((item) => item.description).join();
        res.status(500).json({ message: message || "Internal server error" });
    }
}

export async function loginHandler(req: Request, res: Response) {
    try {
        const { username, password }: AuthFormData = req.body;

        // Basic validation
        if (!username || !password) {
            res.status(400).json({
                message: "Username and password are required",
            });
            return;
        }

        const database = await initializeDatabase();
        const collection = database.collection<User>("users");

        // Find user by username or email
        const user = await collection.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: username.toLowerCase() },
            ],
        });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Update last login time
        await collection.updateOne(
            { _id: user._id },
            { $set: { updatedAt: new Date() } }
        );

        // Generate token
        const token = createToken(user._id);
        const response: AuthResponse = {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
