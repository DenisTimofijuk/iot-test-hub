import dotenv from 'dotenv';

dotenv.config();

export const config = {
    userName: process.env.USER_NAME || "user",
    password: process.env.PASSWORD || "password",
};