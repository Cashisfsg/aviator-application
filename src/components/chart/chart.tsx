import { useState, useRef, useEffect } from "react";

import { useStateSelector } from "@/store/hooks";
import { selectAirplaneState } from "@/store/slices/test.slice";
import { selectAnimationSettings } from "@/store/slices/settingsSlice";

import "./chart.css";
import { Airplane } from "./airplane";
import { Propeller } from "./propeller";
import { Slider } from "./slider";
import { RateCoefficient, RateElement } from "./rate-coefficient";
import { SoundEffects } from "../sound-effects/sound-effects";

export const Chart = () => {
    const [isSliderVisible, setIsSliderVisible] = useState(true);
    const airplaneRef = useRef<SVGUseElement>(null);
    const rateRef = useRef<RateElement>(null);
    const containerRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<Animation>();

    const airplaneState = useStateSelector(state => selectAirplaneState(state));
    const animationEnabled = useStateSelector(state =>
        selectAnimationSettings(state)
    );

    const [startScreen, setStartScreen] = useState(true);

    useEffect(() => {
        if (animationEnabled) {
            airplaneRef.current?.classList.remove("opacity-0");
        } else {
            airplaneRef.current?.classList.add("opacity-0");
        }
    }, [animationEnabled]);

    useEffect(() => {
        const crash = () => {
            if (!airplaneRef.current) return;

            if (animationEnabled) {
                animationRef.current = airplaneRef.current.animate(
                    [
                        {
                            translate: "800px 0px"
                        }
                    ],
                    { duration: 500, iterations: 1, fill: "forwards" }
                );
                setTimeout(() => {
                    animationRef.current?.cancel();
                    airplaneRef.current?.classList.remove("fly");
                    airplaneRef.current?.classList.add("hidden");
                }, 1000);
            }

            rateRef.current?.stopAnimation();
            containerRef.current?.setAttribute("data-active", "false");
            if (startScreen) setStartScreen(false);
            if (isSliderVisible) setIsSliderVisible(false);
            if (!rateRef.current?.className?.includes("opacity-100")) {
                if (!rateRef.current) return;
                rateRef.current.className =
                    rateRef.current?.className + " opacity-100";
            }
        };

        const startGame = () => {
            if (!airplaneRef.current) return;

            setStartScreen(true);

            if (
                animationEnabled &&
                airplaneRef.current.classList.contains("hidden")
            )
                airplaneRef.current?.classList.remove("hidden");
        };

        const restart = () => {
            if (!airplaneRef.current) return;

            rateRef.current?.resetAnimation();

            containerRef.current?.setAttribute("data-active", "true");
        };

        const loading = () => {
            restart();
            startGame();
        };

        const game = () => {
            rateRef.current?.startAnimation();
            setStartScreen(false);
            if (animationEnabled) {
                airplaneRef.current?.classList.add("fly");
                // airplaneRef.current?.classList.add("fly");
                // airplaneRef.current?.classList.remove("hidden");
            } else {
                airplaneRef.current?.classList.remove("fly");
                // airplaneRef.current?.classList.remove("fly");
                // airplaneRef.current?.classList.add("hidden");
            }
        };

        if (airplaneState === "loading") {
            loading();
            setIsSliderVisible(true);
        } else if (airplaneState === "crash") {
            crash();
            // setTimeout(() => {
            //     setIsSliderVisible(false);
            // }, 500);
        } else if (airplaneState === "start") {
            game();
            // if (!isSliderVisible) setIsSliderVisible(false);
        }
    }, [animationEnabled, airplaneState]);

    return (
        <section>
            {/* {!isAuthenticated ? (
                <h2 className="rounded-t-2.5xl bg-[#e59407cc] text-xl font-bold uppercase">
                    Fun mode
                </h2>
            ) : null} */}

            <figure className="rounded-2.5xl">
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
                        <Slider isVisible={isSliderVisible} />
                        <Airplane />
                    </defs>

                    <use
                        id="use-airplane"
                        width="170"
                        height="72"
                        href="#airplane"
                        className="airplane origin-top-left"
                        ref={airplaneRef}
                    >
                        {/* <animateMotion
                            path="M21,203 C151,210 289,164 321,27 z"
                            dur="3s"
                            repeatCount="indefinite"
                            // rotate="auto"
                            fill="remove"
                        /> */}
                    </use>

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
                                className="origin-center -translate-x-6 -translate-y-6"
                                x="50%"
                                y="50%"
                                onAnimationEnd={event => {
                                    event.currentTarget.parentElement?.classList.replace(
                                        "opacity-100",
                                        "opacity-0"
                                    );
                                    setIsSliderVisible(false);
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
                            {isSliderVisible ? (
                                <use
                                    className="use-slider"
                                    href="#slider"
                                    x="50%"
                                    y="50%"
                                />
                            ) : null}
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
        </section>
    );
};
