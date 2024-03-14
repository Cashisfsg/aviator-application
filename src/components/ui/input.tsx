import * as React from "react";

import { IoWarningOutline } from "react-icons/io5";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

import { cn } from "@/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
            role="alert"
            className={cn("block text-xs text-red-750", className)}
        >
            <IoWarningOutline className="mt-[1.5px] inline align-top" />{" "}
            {message}
        </output>
    );
};

interface PasswordProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
    ({ className, ...props }, forwardRef) => {
        const [visible, toggleVisibility] = React.useReducer(
            state => !state,
            false
        );

        return (
            <div className="flex h-max items-center rounded-lg border-2 border-gray-500 outline outline-2 outline-offset-1 outline-transparent has-[input[aria-invalid=true]]:border-red-750 has-[input:focus-visible]:outline-white/80">
                <input
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                    ref={forwardRef}
                    className={cn(
                        "flex-auto bg-transparent px-4 py-2 focus-visible:outline-transparent",
                        className
                    )}
                    {...props}
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="h-10 shrink-0 basis-10 focus-visible:outline-white/80"
                >
                    {visible ? (
                        <IoIosEyeOff className="mx-auto text-xl" />
                    ) : (
                        <IoIosEye className="mx-auto text-xl" />
                    )}
                </button>
            </div>
        );
    }
);
