import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setInviteLink } from "@/store/slices/authSlice";

export const ReferralRedirect = () => {
    const [searchParams] = useSearchParams();

    const dispatch = useAppDispatch();

    const uid = searchParams.get("uid");

    useEffect(() => {
        if (!uid) return;

        dispatch(setInviteLink(uid));
    }, [uid]);

    return <Navigate to="/main" />;
};
