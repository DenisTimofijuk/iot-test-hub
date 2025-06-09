import "./css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataFlow } from "./pages/Intro";
import { Dashboard, dashboardDataLoader } from "./pages/Dashboard";
import { RootLayout } from "./pages/Root";
import ErrorPage from "./pages/Error";
import Authentication from "./pages/Authentication";
import { checkAuthentication } from "./util/auth";
import { rootRedirectLoader } from "./util/rootRedirectLoader";

const router = createBrowserRouter([
    // This solution works, but it causes an annoying React error:
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
                loader: checkAuthentication
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                loader: ()=> {
                    checkAuthentication();
                    return dashboardDataLoader
                },
            },
            {
                path: "auth",
                element: <Authentication />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
