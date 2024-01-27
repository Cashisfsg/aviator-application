import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SignInButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                if (open) sessionStorage.removeItem("email");
                setOpen(open => !open);
            }}
        >
            <DialogTrigger asChild>
                <Link
                    to="/main/sign-in"
                    className="rounded-lg bg-green-400 px-4 py-3 font-bold"
                >
                    Вход
                </Link>
            </DialogTrigger>
            <DialogContent className="w-80" />
        </Dialog>
    );
};
