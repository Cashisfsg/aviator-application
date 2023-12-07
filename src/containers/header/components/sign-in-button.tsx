import { useId } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

export const SignInButton = () => {
    const loginId = useId();
    const passwordId = useId();

    return (
        <Dialog>
            <DialogTrigger className="bg-green-400 px-4 py-3 font-bold">
                Вход
            </DialogTrigger>
            <DialogContent className="bg-black-50 w-80">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                        Вход
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Добро пожаловать в игру Aviator
                    </DialogDescription>
                    <form>
                        <label
                            htmlFor={loginId}
                            className="mt-8"
                        >
                            Логин
                        </label>
                        <input
                            type="text"
                            id={loginId}
                            className="w-full rounded-lg border-2 border-gray-500 bg-transparent px-4 py-2 outline-transparent"
                        />

                        <label
                            htmlFor={passwordId}
                            className="mt-8"
                        >
                            Пароль
                        </label>
                        <input
                            type="password"
                            id={passwordId}
                            className="w-full rounded-lg border-2 border-gray-500 bg-transparent px-4 py-2 outline-transparent outline-transparent"
                        />

                        <p className="text-right text-sm text-blue-500">
                            <a href="">Забыли пароль?</a>
                        </p>
                        <button className="w-full bg-blue-500 py-2 text-xl font-bold text-white">
                            Войти
                        </button>
                    </form>
                    <p className="text-sm">Ещё нет аккаунта</p>
                    <a
                        href=""
                        className="text-base text-blue-500"
                    >
                        Зарегистрироваться
                    </a>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
