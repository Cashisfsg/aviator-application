import * as React from "react";

import { IoWarningOutline } from "react-icons/io5";

import { cn } from "@/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                autoComplete="off"
                className={cn(
                    "block w-full rounded-lg border-2 border-gray-500 bg-transparent px-4 py-2 outline-transparent aria-[invalid=true]:border-red-750",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };

interface ErrorMessageProps
    extends React.OutputHTMLAttributes<HTMLOutputElement> {
    message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    className,

    ...props
}) => {
    return (
        <output
            {...props}
            className={cn("block text-xs text-red-750", className)}
        >
            <IoWarningOutline className="mt-[1.5px] inline align-top" />{" "}
            {message}
        </output>
    );
};
