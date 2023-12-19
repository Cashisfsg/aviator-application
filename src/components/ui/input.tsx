import * as React from "react";

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
