import { redirect } from "react-router-dom";
import { StorageKeys } from "../types/LocalStorage.type";

export function logout() {

    localStorage.removeItem(StorageKeys.Token);
    localStorage.removeItem(StorageKeys.expiresAt);
    
    return redirect('/');
}