export interface User {
    _id?: string; // MongoDB ObjectId as string
    email: string;
    username: string;
    password_hash: string; // Optional for security - may not be included in responses
    role: 'admin' | 'user' | 'viewer';
    active: boolean;
    created_at: Date;
    updated_at?: Date;
}

// For user creation requests (excluding auto-generated fields)
export interface CreateUserRequest {
    email: string;
    username: string;
    password: string; // Plain password before hashing
    role?: 'admin' | 'user' | 'viewer'; // Optional, defaults to 'user'
}

// For user update requests
export interface UpdateUserRequest {
    email?: string;
    username?: string;
    role?: 'admin' | 'user' | 'viewer';
    active?: boolean;
}

// For public user data (excluding sensitive fields)
export interface PublicUser {
    _id: string;
    email: string;
    username?: string;
    role: 'admin' | 'user' | 'viewer';
    active: boolean;
    created_at: Date;
    updated_at?: Date;
}

// For authentication responses
export interface AuthUser {
    _id: string;
    email: string;
    username?: string;
    role: 'admin' | 'user' | 'viewer';
    active: boolean;
}