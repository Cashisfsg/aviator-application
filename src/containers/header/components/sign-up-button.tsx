import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SignUpButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Link
                    to="/main/sign-up"
                    className="rounded-lg bg-red-400 px-4 py-3 font-bold"
                >
                    Регистрация
                </Link>
            </DialogTrigger>
            <DialogContent className="w-80 bg-black-50" />
        </Dialog>
    );
};
