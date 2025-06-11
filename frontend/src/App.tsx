import "./css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataFlow } from "./pages/Intro";
import { Dashboard, dashboardDataLoader } from "./pages/Dashboard";
import { RootLayout } from "./pages/Root";
import ErrorPage from "./pages/Error";
import Authentication from "./pages/Authentication";
import { checkAuthenticationLoader, getTokenFromLocalStor, getUserFromLocalStor } from "./util/auth";
import { rootRedirectLoader } from "./util/rootRedirectLoader";
import { logout } from "./pages/Logout";
import { UserContext } from "./components/userContext";
import type { UserContextType } from "./types/UserContex.typet";
import { useEffect, useState } from "react";
import type { AuthFormData, TokenType } from "@iot-test-hub/shared";

const router = createBrowserRouter([
    // The solution below to redirecting unauthorized users works.
    // However, it causes an annoying React error.
    {
        path: "/",
        loader: rootRedirectLoader,
        element: <div />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "home",
                element: <DataFlow />,
                loader: checkAuthenticationLoader,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                loader: () => {
                    checkAuthenticationLoader();
                    return dashboardDataLoader();
                },
            },
            {
                path: "auth",
                element: <Authentication />,
            },
            {
                path: "logout",
                loader: logout,
            },
        ],
    },
]);

function App() {
    const [user, setUser] = useState<AuthFormData>();
    const [token, setToken] = useState<TokenType>();

    useEffect(() => {
        const user = getUserFromLocalStor();
        const tokenData = getTokenFromLocalStor();
        if (tokenData.token && tokenData.exDate) {
            setToken({
                token: tokenData.token,
                expiresAt: tokenData.exDate.toISOString(),
                ttlMs: 0,
                ttlSeconds: 0,
            });
        }
        if("username" in user){
            setUser(user);
        }
    }, []);

    const ctxValue: UserContextType = {
        user,
        setUser,
        token,
        setToken,
    };

    return (
        <UserContext value={ctxValue}>
            <RouterProvider router={router} />;
        </UserContext>
    );
}

export default App;
