import { createContext } from 'react';
import type { UserContextType } from '../types/UserContex.typet';

export const UserContext = createContext<UserContextType>({
    user: {email: "", username: "", confirmPassword: "", password: ""},
    setUser: () => {},
    token: {token: "", expiresAt: "", ttlMs: 0, ttlSeconds: 0},
    setToken: () => {}
});