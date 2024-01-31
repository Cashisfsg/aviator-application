import { useRef, useEffect, useReducer } from "react";

import { useStateSelector, selectSettings, selectSocket } from "@/store";

import TakeOnSound from "@/assets/sound/take-on.mp3";
import TakeOffSound from "@/assets/sound/take-off.mp3";

export const SoundEffects = () => {
    const takeOnAudioRef = useRef<HTMLAudioElement>(null);
    const takeOffAudioRef = useRef<HTMLAudioElement>(null);
    const [gameStarted, toggleState] = useReducer(state => !state, false);

    const socket = useStateSelector(state => selectSocket(state));
    const { soundEnabled } = useStateSelector(state => selectSettings(state));

    useEffect(() => {
        // { x }: { x: number }
        const playStartRoundSound = ({ x }: { x: number }) => {
            if (!soundEnabled) {
                socket.off("game", playStartRoundSound);
                return;
            }

            if (x <= 1) return;

            if (gameStarted) {
                socket.off("game", playStartRoundSound);
                return;
            }

            if (!takeOnAudioRef.current) return;

            takeOnAudioRef.current.currentTime = 0.6;
            takeOnAudioRef.current?.play();
            toggleState();
        };

        const playFinishRoundSound = () => {
            if (!soundEnabled) {
                socket.off("crash", playFinishRoundSound);
                return;
            }

            if (!takeOnAudioRef.current || !takeOffAudioRef.current) return;

            toggleState();
            takeOnAudioRef.current.pause();
            takeOnAudioRef.current.currentTime = 0;
            takeOffAudioRef.current.currentTime = 0.8;

            takeOffAudioRef.current?.play();
        };

        socket.on("game", playStartRoundSound);
        socket.on("crash", playFinishRoundSound);

        return () => {
            socket.off("game", playStartRoundSound);
            socket.off("crash", playFinishRoundSound);
        };
    }, [socket, soundEnabled, gameStarted]);

    if (!soundEnabled) {
        return <></>;
    }

    return (
        <>
            <audio
                preload="auto"
                ref={takeOnAudioRef}
            >
                <source
                    src={TakeOnSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>

            <audio
                preload="auto"
                ref={takeOffAudioRef}
            >
                <source
                    src={TakeOffSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>
        </>
    );
};
