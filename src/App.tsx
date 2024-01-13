import { useEffect, lazy, Suspense } from "react";
import GridLoader from "react-spinners/GridLoader";

import "./App.css";
// import { ReactRouterProvider } from "@/router/provider";
import { useAppDispatch, setUserInitData, TelegramClient } from "./store";

const ReactRouterProvider = lazy(async () =>
    import("@/router/provider").then(module => ({
        default: module.ReactRouterProvider
    }))
);

export const App = () => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const dispatch = useAppDispatch();

    useEffect(() => {
        // if (!tg?.initDataUnsafe?.user?.id) return;

        // console.log(tg?.initDataUnsafe?.user?.id);
        dispatch(
            setUserInitData({
                telegramId: 456,
                profileImage: "asdsd",
                login: "User login"
            })
        );
    }, [tg?.initDataUnsafe?.user?.id]);

    return (
        <Suspense
            fallback={
                <GridLoader
                    className="fixed left-1/2 top-1/2"
                    color={"red"}
                />
            }
        >
            <ReactRouterProvider />
        </Suspense>
    );
};
