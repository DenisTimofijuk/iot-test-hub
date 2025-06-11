import { Outlet, useNavigation } from "react-router-dom";
import { RootHeader } from "../components/Header";
import { TokenExpiryModal } from "../components/TokenExpiryModal";
import { useTokenExpiry } from "../hooks/useTokenExpiry";

export function RootLayout() {
    const navigation = useNavigation();
    const { showExpiryModal, timeRemaining, extendSession, logout, close } = useTokenExpiry();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-10">
            <RootHeader></RootHeader>
            <main>
                {navigation.state === "loading" && (
                    <p>Loading please wait...</p>
                )}
                <Outlet />
            </main>
            <TokenExpiryModal
                isOpen={showExpiryModal}
                onExtend={extendSession}
                onLogout={logout}
                onClose={close}
                timeRemaining={timeRemaining}
            />
        </div>
    );
}
