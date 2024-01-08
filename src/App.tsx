import { useEffect } from "react";

import "./App.css";
import { ReactRouterProvider } from "./router/provider";
import { useAppDispatch, setUndefinedUser, TelegramClient } from "./store";

export const App = () => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const dispatch = useAppDispatch();

    useEffect(() => {
        // if (!tg?.initDataUnsafe?.user?.id) return;

        // console.log(tg?.initDataUnsafe?.user?.id);
        dispatch(
            setUndefinedUser({
                telegramId: 21,
                profileImage: "asdsd",
                login: "Login"
            })
        );
    }, [tg?.initDataUnsafe?.user?.id]);

    return <ReactRouterProvider />;
};
