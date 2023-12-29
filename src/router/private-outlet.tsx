import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";

interface PrivateRouteProps {
    to: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ to }) => {
    const { isAuthenticated } = useAuth();
    // const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate
            to={to}
            replace={true}
        />
    );
};
