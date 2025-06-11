import "./css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataFlow } from "./pages/Intro";
import { Dashboard, dashboardDataLoader } from "./pages/Dashboard";
import { RootLayout } from "./pages/Root";
import ErrorPage from "./pages/Error";
import Authentication from "./pages/Authentication";
import { checkAuthenticationLoader } from "./util/auth";
import { rootRedirectLoader } from "./util/rootRedirectLoader";
import { logout } from "./pages/Logout";

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
                loader: checkAuthenticationLoader
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                loader: ()=> {
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
                loader: logout
            }
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
