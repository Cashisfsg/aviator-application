import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SignInButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Link
                    to="/aviator_front/"
                    className="rounded-lg bg-green-400 px-4 py-3 font-bold"
                >
                    Вход
                </Link>
            </DialogTrigger>
            <DialogContent className="w-80" />
        </Dialog>
    );
};
