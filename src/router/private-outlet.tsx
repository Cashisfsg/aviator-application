import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";

export const PrivateRoute = () => {
    const { token } = useAuth();
    const location = useLocation();

    return token ? (
        <Outlet />
    ) : (
        <Navigate
            to="/aviator_front/main"
            state={{ from: location }}
        />
    );
};
