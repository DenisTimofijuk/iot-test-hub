import { redirect } from "react-router-dom";
import { getAuthToken } from "./auth";

export function rootRedirectLoader() {
    const token = getAuthToken();

    if (token) {
        return redirect("/home");
    } else {
        return redirect("/auth");
    }
}
