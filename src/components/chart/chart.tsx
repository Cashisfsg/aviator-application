import { useRef } from "react";
import "./chart.css";
import { Airplane } from "./airplane";
import { Propeller } from "./propeller";
import { Slider } from "./slider";
import { RateCoefficient, RateElement } from "./rate-coefficient";

export const Chart = () => {
    const airplaneRef = useRef<SVGUseElement>(null);
    const rateRef = useRef<RateElement>(null);
    const animationRef = useRef<Animation>();

    return (
        <section>
            <h2 className="rounded-t-2.5xl bg-[#e59407cc] text-xl font-bold uppercase">
                Fun mode
            </h2>

            <figure className="rounded-b-2.5xl">
                <svg
                    width="100%"
                    viewBox="0 0 557 253"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="svg-container aspect-video rounded-b-2.5xl border border-gray-50"
                >
                    <defs>
                        <Propeller />
                        <Slider />
                        <Airplane />
                    </defs>
                    <use
                        id="use-airplane"
                        width="85"
                        height="36"
                        href="#airplane"
                        className="airplane origin-top-left"
                        ref={airplaneRef}
                    />
                    <g
                        onTransitionEnd={event => {
                            event.stopPropagation();
                            airplaneRef.current?.classList.add("fly");

                            rateRef.current?.startAnimation();
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

                    <RateCoefficient ref={rateRef} />
                </svg>
            </figure>
            <button
                onClick={() => {
                    if (!airplaneRef.current) return;

                    airplaneRef.current.style.animationPlayState = "paused";
                }}
            >
                Пауза
            </button>
            <button
                onClick={() => {
                    if (!airplaneRef.current) return;

                    airplaneRef.current.style.animationIterationCount = "1";

                    animationRef.current = airplaneRef.current.animate(
                        [
                            {
                                translate: "800px 0px"
                            }
                        ],
                        { duration: 1000, iterations: 1, fill: "forwards" }
                    );
                    rateRef.current?.stopAnimation();
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
                }}
            >
                Сброс
            </button>
        </section>
    );
};
