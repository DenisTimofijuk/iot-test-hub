import "./css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataFlow } from "./pages/Intro";
import { Dashboard, dashboardDataLoader } from "./pages/Dashboard";
import { RootLayout } from "./pages/Root";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "", element: <DataFlow /> },
            {
                path: "dashboard",
                element: <Dashboard />,
                loader: dashboardDataLoader,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
