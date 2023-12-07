import { useId } from "react";

export const RegistrationForm = () => {
    const loginId = useId();
    const passwordId = useId();

    return (
        <dialog className="fixed left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-4 text-black">
            <header>
                <h2 className="text-4xl font-bold">Вход</h2>
                <p className="text-xl">
                    Добро пожаловать в игру
                    <br /> Aviator
                </p>
            </header>
            <form>
                <label htmlFor={loginId}>Логин</label>
                <input
                    type="text"
                    id={loginId}
                    className="w-full rounded-lg border-2 border-gray-500 bg-transparent px-4 py-2 outline-transparent"
                />

                <label htmlFor={passwordId}>Пароль</label>
                <input
                    type="password"
                    id={passwordId}
                    className="w-full rounded-lg border-2 border-gray-500 bg-transparent px-4 py-2 outline-transparent outline-transparent"
                />

                <p className="text-right text-sm text-blue-500">
                    <a href="">Забыли пароль?</a>
                </p>
                <button className="w-full bg-blue-500 py-4 text-3xl font-bold text-white">
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
        </dialog>
    );
};
