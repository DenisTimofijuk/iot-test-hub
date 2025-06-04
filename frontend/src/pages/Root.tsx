import { Outlet, useNavigation } from "react-router-dom";
import { RootHeader } from "../components/Header";

export function RootLayout() {
    const navigation = useNavigation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-10">
            <RootHeader></RootHeader>
            <main>
                {navigation.state === "loading" && (
                    <p>Loading please wait...</p>
                )}
                <Outlet />
            </main>
        </div>
    );
}
