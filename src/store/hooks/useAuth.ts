import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthenticationStatus } from "../slices/authSlice";

export const useAuth = () => {
    const token = useSelector(getAuthenticationStatus);

    return useMemo(() => ({ token }), [token]);
};
