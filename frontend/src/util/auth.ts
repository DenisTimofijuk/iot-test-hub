import { redirect } from "react-router-dom";
import { StorageKeys } from "../types/LocalStorage";

export function getAuthToken() {
    return localStorage.getItem(StorageKeys.Token);
}

export function checkAuthentication() {
    const token = getAuthToken();

    if(!token){
        return redirect('/auth');
    }

    return null;
}

export function isLoggedIn() {
    const token = getAuthToken();
    return !!token;
}

/**
 * TODO:
 * Current token lives only for 1 hour.
 * In FE we are not handling this,
 * so user can be very surprised why sudenly he is unabel to continue his work.
 */