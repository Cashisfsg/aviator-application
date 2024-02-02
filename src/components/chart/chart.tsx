import { useState, useRef, useEffect } from "react";
import {
    // useAuth,
    useStateSelector,
    selectSocket,
    selectSettings
} from "@/store";
// import { socket } from "@/components/socket/socket";
import "./chart.css";
import { Airplane } from "./airplane";
import { Propeller } from "./propeller";
import { Slider } from "./slider";
import { RateCoefficient, RateElement } from "./rate-coefficient";
import { SoundEffects } from "../sound-effects/sound-effects";

export const Chart = () => {
    const airplaneRef = useRef<SVGUseElement>(null);
    const rateRef = useRef<RateElement>(null);
    const containerRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<Animation>();

    // const { isAuthenticated } = useAuth();
    const socket = useStateSelector(state => selectSocket(state));
    const { animationEnabled } = useStateSelector(state =>
        selectSettings(state)
    );

    const [startScreen, setStartScreen] = useState(true);

    useEffect(() => {
        const crash = () => {
            if (!airplaneRef.current) return;

            animationRef.current = airplaneRef.current.animate(
                [
                    {
                        translate: "800px 0px"
                    }
                ],
                { duration: 1000, iterations: 1, fill: "forwards" }
            );
            rateRef.current?.stopAnimation();
            containerRef.current?.setAttribute("data-active", "false");
        };

        const startGame = () => {
            if (!airplaneRef.current) return;

            setStartScreen(true);
        };

        const restart = () => {
            if (!airplaneRef.current) return;
            rateRef.current?.resetAnimation();
            airplaneRef.current.classList.remove("fly");
            animationRef.current?.cancel();
            containerRef.current?.setAttribute("data-active", "true");
        };

        const loading = () => {
            restart();
            startGame();
        };

        const game = () => {
            airplaneRef.current?.classList.add("fly");

            rateRef.current?.startAnimation();
            setStartScreen(false);
        };

        socket.on("crash", crash);
        socket.on("loading", loading);
        socket.on("game", game);

        return () => {
            socket.off("crash", crash);
            socket.off("loading", loading);
            socket.off("game", game);
        };
    }, [socket]);

    return (
        <section>
            {/* {!isAuthenticated ? (
                <h2 className="rounded-t-2.5xl bg-[#e59407cc] text-xl font-bold uppercase">
                    Fun mode
                </h2>
            ) : null} */}

            <figure className="rounded-2.5xl ">
                <svg
                    width="100%"
                    viewBox="0 0 557 253"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    ref={containerRef}
                    data-active={true}
                    className="svg-container aspect-video rounded-2.5xl border border-gray-50"
                >
                    <defs>
                        <Propeller />
                        <Slider />
                        <Airplane />
                    </defs>

                    <use
                        id="use-airplane"
                        width="170"
                        height="72"
                        href="#airplane"
                        className="airplane origin-top-left"
                        ref={airplaneRef}
                    />

                    {startScreen ? (
                        <g
                            onTransitionEnd={event => {
                                event.stopPropagation();
                                // airplaneRef.current?.classList.add("fly");

                                // rateRef.current?.startAnimation();
                                // setStartScreen(false);
                            }}
                            className="opacity-100 transition-all duration-500"
                        >
                            <use
                                id="use-propeller"
                                href="#propeller"
                                transform="translate(-24, -24)"
                                className="origin-center "
                                x="50%"
                                y="50%"
                                onAnimationEnd={event => {
                                    event.currentTarget.parentElement?.classList.replace(
                                        "opacity-100",
                                        "opacity-0"
                                    );
                                }}
                            />
                            <text
                                transform="translate(0, -40)"
                                fill="#fff"
                                textAnchor="middle"
                                x="50%"
                                y="50%"
                                fontSize="1.5rem"
                                className="text-center font-semibold uppercase"
                            >
                                Ожидаем новый раунд
                            </text>
                            <use
                                href="#slider"
                                x="50%"
                                y="50%"
                                transform="translate(-65, 40)"
                            />
                        </g>
                    ) : null}

                    <RateCoefficient ref={rateRef} />
                    <g transform="translate(10, 270) scale(0.95, 1)">
                        {Array(10)
                            .fill(0)
                            .map((_, i) => (
                                <g key={i}>
                                    <circle
                                        cx={
                                            animationEnabled
                                                ? "10"
                                                : `${(i + 1) * 10}%`
                                        }
                                        cy="0"
                                        r="2"
                                        fill="white"
                                    >
                                        {animationEnabled ? (
                                            <animate
                                                attributeName="cx"
                                                values={`${(i + 1) * 10}%; ${
                                                    i * 10
                                                }%`}
                                                dur="10s"
                                                begin="0s"
                                                repeatCount="indefinite"
                                            />
                                        ) : null}
                                    </circle>
                                </g>
                            ))}
                    </g>
                    <svg
                        height="295"
                        x="0"
                        y="-25"
                    >
                        {Array(10)
                            .fill(0)
                            .map((_, i) => (
                                <g key={i}>
                                    <circle
                                        cx="10"
                                        cy={
                                            animationEnabled
                                                ? "0"
                                                : `${(i + 0.5) * 10}%`
                                        }
                                        r="2"
                                        fill="red"
                                    >
                                        {animationEnabled ? (
                                            <animate
                                                attributeName="cy"
                                                values={`${i * 10}%; ${
                                                    (i + 1) * 10
                                                }%`}
                                                dur="10s"
                                                begin="0s"
                                                repeatCount="indefinite"
                                            />
                                        ) : null}
                                    </circle>
                                </g>
                            ))}
                    </svg>
                </svg>
            </figure>
            <SoundEffects />
            {/* <button
                onClick={() => {
                    if (!airplaneRef.current) return;

                    setStartScreen(true);
                }}
            >
                Старт
            </button>
            <button
                onClick={() => {
                    if (!airplaneRef.current) return;

                    animationRef.current = airplaneRef.current.animate(
                        [
                            {
                                translate: "800px 0px"
                            }
                        ],
                        { duration: 1000, iterations: 1, fill: "forwards" }
                    );
                    rateRef.current?.stopAnimation();
                    containerRef.current?.setAttribute("data-active", "false");
                }}
            >
                Улететь
            </button>
            <button
                onClick={() => {
                    if (!airplaneRef.current) return;
                    rateRef.current?.resetAnimation();
                    airplaneRef.current.classList.remove("fly");
                    animationRef.current?.cancel();
                    containerRef.current?.setAttribute("data-active", "true");
                }}
            >
                Сброс
            </button> */}
        </section>
    );
};
