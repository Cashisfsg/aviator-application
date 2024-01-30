import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    value: number | undefined;
}

export const Badge: React.FC<BadgeProps> = ({ className, value, ...props }) => {
    if (isNaN(Number(value))) return "-";

    return (
        <span
            className={cn(generateClassName(value), className)}
            {...props}
        >
            {value?.toFixed(2)}x
        </span>
    );
};

const generateClassName = (value: number | undefined): string | undefined => {
    if (value === undefined) return;

    const baseClassName =
        "rounded-full w-[52px] py-0.5 text-xs font-bold bg-black-50";

    if (value < 2) return baseClassName + " text-[#34b4ff]";
    else if (value < 10) return baseClassName + " text-[#913ef8]";

    return baseClassName + " text-[#c017b4]";
};
