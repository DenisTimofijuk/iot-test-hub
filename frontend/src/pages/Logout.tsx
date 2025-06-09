import { redirect } from "react-router-dom";
import { StorageKeys } from "../types/LocalStorage";

export function logout() {
    console.log('LogoutAction')

    localStorage.removeItem(StorageKeys.Token);

    return redirect('/');
}