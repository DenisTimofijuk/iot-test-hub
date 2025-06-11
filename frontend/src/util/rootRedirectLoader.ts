import { redirect } from "react-router-dom";
import { getTokenFromLocalStor } from "./auth";

export function rootRedirectLoader() {
    const token = getTokenFromLocalStor();

    if (token) {
        return redirect("/home");
    } else {
        return redirect("/auth");
    }
}
