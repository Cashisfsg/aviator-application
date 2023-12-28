import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";

export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate
            to="/aviator_front/main"
            state={{ from: location }}
        />
    );
};
