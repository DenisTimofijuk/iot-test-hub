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