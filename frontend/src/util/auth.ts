import { redirect } from "react-router-dom";
import { StorageKeys } from "../types/LocalStorage.type";
import type { AuthFormData } from "@iot-test-hub/shared";

export function getTokenFromLocalStor() {
    const token = localStorage.getItem(StorageKeys.Token);
    const expirationDate = localStorage.getItem(StorageKeys.expiresAt);
    const exDate = expirationDate && new Date(expirationDate) || new Date();
    return {
        token,
        exDate
    }
}

export function getUserFromLocalStor() {
    const userRawData = localStorage.getItem(StorageKeys.user);
    const user: AuthFormData | {} = userRawData && JSON.parse(userRawData) || {};

    return user;
}

export function checkAuthenticationLoader() {
    const tokenData = getTokenFromLocalStor();

    if(!tokenData.token || tokenData.exDate <= new Date()){        
        return redirect('/auth');
    }

    return null;
}

export function isLoggedIn() {
    const tokenData = getTokenFromLocalStor();

    return tokenData.token && tokenData.exDate > new Date()
}

/**
 * TODO:
 * Current token lives only for 1 hour.
 * In FE we are not handling this,
 * so user can be very surprised why sudenly he is unabel to continue his work.
 */