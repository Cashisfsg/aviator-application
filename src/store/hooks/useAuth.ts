import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthenticationStatus } from "../slices/authSlice";

export const useAuth = () => {
    const authState = useSelector(getAuthenticationStatus);

    return useMemo(() => authState, [authState]);
};
