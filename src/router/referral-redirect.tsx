import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setInviteLink } from "@/store/slices/authSlice";

export const ReferralRedirect = () => {
    const [searchParams] = useSearchParams();

    const dispatch = useAppDispatch();

    const username = searchParams.get("username");

    useEffect(() => {
        if (!username) return;

        dispatch(setInviteLink(username));
    }, [username]);

    if (username) return <Navigate to="/main" />;

    return <></>;
};
