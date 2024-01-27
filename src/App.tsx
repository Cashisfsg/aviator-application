import { useEffect, lazy, Suspense } from "react";
import GridLoader from "react-spinners/GridLoader";

import "./App.css";
// import { ReactRouterProvider } from "@/router/provider";
import {
    useAppDispatch,
    setUserInitData,
    TelegramClient
    // useStateSelector,
    // setGameDetails,
    // GameDetails,
    // selectSocket
} from "./store";

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
    // const socket = useStateSelector(state => selectSocket(state));

    useEffect(() => {
        if (!tg?.initDataUnsafe?.user) return;

        // console.log(tg?.initDataUnsafe?.user?.id);
        dispatch(
            setUserInitData({
                telegramId: tg?.initDataUnsafe?.user?.id,
                profileImage: tg?.initDataUnsafe?.user?.photo_url,
                login: tg?.initDataUnsafe?.user?.first_name
            })
        );
    }, [
        tg?.initDataUnsafe?.user?.id,
        tg?.initDataUnsafe?.user?.photo_url,
        tg?.initDataUnsafe?.user?.first_name
    ]);

    // useEffect(() => {
    //     const onGameDataUpdated = (data: GameDetails) => {
    //         dispatch(setGameDetails(data));
    //     };

    //     socket.on("currentPlayers", onGameDataUpdated);

    //     return () => {
    //         socket.off("currentPlayers", onGameDataUpdated);
    //     };
    // }, [socket]);

    return (
        <Suspense
            fallback={
                <GridLoader
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    color={"red"}
                />
            }
        >
            <ReactRouterProvider />
        </Suspense>
    );
};
