import { useEffect, useRef, lazy, Suspense } from "react";
import GridLoader from "react-spinners/GridLoader";
import BackgroundMusic from "./assets/sound/background_music.mp3";

import "./App.css";
// import { ReactRouterProvider } from "@/router/provider";
import {
    useAppDispatch,
    setUserInitData,
    TelegramClient,
    useStateSelector,
    selectSettings
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

    const audioRef = useRef<HTMLAudioElement>(null);
    const dispatch = useAppDispatch();
    const { musicEnabled } = useStateSelector(state => selectSettings(state));
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

    useEffect(() => {
        if (musicEnabled) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [musicEnabled]);

    return (
        <>
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
            <audio
                loop
                autoPlay
                preload="auto"
                ref={audioRef}
            >
                <source
                    src={BackgroundMusic}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>
        </>
    );
};
