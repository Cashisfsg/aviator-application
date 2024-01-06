import { Link, useNavigate } from "react-router-dom";

import { IoMdArrowRoundBack } from "react-icons/io";

import { cn } from "@/utils";

export const PreviousRouteLink = ({ className }: { className?: string }) => {
    const navigate = useNavigate();

    return (
        <Link
            to=""
            onClick={() => navigate(-1)}
            className={cn(
                "absolute -top-0.5 p-0 text-base text-white-50 transition-colors hover:text-slate-300",
                className
            )}
        >
            <IoMdArrowRoundBack />
        </Link>
    );
};
