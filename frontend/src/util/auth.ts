import { redirect } from "react-router-dom";

export function getAuthToken() {
    return localStorage.getItem('token');
}

export function checkAuthentication() {
    const token = getAuthToken();

    console.log("checkAuthentication", token);

    if(!token){
        return redirect('/auth');
    }

    return null;
}