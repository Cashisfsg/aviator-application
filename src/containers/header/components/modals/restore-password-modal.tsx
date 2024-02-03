import { Link, Outlet, useNavigate } from "react-router-dom";

import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";

import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";

export const RestorePasswordModal = () => {
    const navigate = useNavigate();

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    <Button
                        // to=""
                        onClick={() => navigate(-1)}
                        className="mh:hover:text-slate-300 absolute left-4 top-4 p-0 text-2xl text-white-50 transition-colors"
                    >
                        <IoMdArrowRoundBack />
                    </Button>
                    Восстановление
                </DialogTitle>
                <DialogDescription>
                    Добро пожаловать в игру Aviator
                </DialogDescription>
            </DialogHeader>

            <Outlet />

            <DialogFooter className="grid grid-cols-2 gap-x-5">
                <p className="text-center text-sm">
                    <span className="text-xs">Ещё нет аккаунта?</span>
                    <br />
                    <Link
                        to="/main/sign-up"
                        className="text-xs text-blue-500"
                    >
                        Зарегистрироваться
                    </Link>
                </p>
                <p className="text-center text-sm">
                    <span className="text-xs">Не привязана почта?</span>
                    <br />
                    <Link
                        to="/main/sign-up"
                        className="text-xs text-blue-500"
                    >
                        Восстановить без почты
                    </Link>
                </p>
            </DialogFooter>
        </>
    );
};
