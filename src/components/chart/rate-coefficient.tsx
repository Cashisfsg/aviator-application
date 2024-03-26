import { useRef, useEffect } from "react";

import { selectAirplaneState, selectRate } from "@/store/slices/test.slice";
import { useStateSelector } from "@/store/hooks";

export interface RateElement extends React.ComponentProps<"g"> {
    startAnimation: () => void;
    stopAnimation: () => void;
    resetAnimation: () => void;
}

export const RateCoefficient = ({ ...props }) => {
    const rate = useStateSelector(state => selectRate(state));

    const groupRef = useRef<SVGGElement>(null);
    const textRef = useRef<SVGTextElement>(null);
    const rateRef = useRef<SVGTextElement>(null);

    const airplaneState = useStateSelector(state => selectAirplaneState(state));

    useEffect(() => {
        if (airplaneState === "start") {
            groupRef.current?.classList.replace("opacity-0", "opacity-100");
        } else if (airplaneState === "crash") {
            groupRef.current?.classList.replace("opacity-0", "opacity-100");

            textRef.current?.classList.remove("opacity-0");
            textRef.current?.classList.add("opacity-100");
            rateRef.current?.setAttribute("fill", "#e50539");
        } else if (airplaneState === "loading") {
            groupRef.current?.classList.replace("opacity-100", "opacity-0");

            textRef.current?.classList.replace("opacity-100", "opacity-0");
            rateRef.current?.setAttribute("fill", "#fff");
        }
    }, [airplaneState]);

    return (
        <g
            ref={groupRef}
            className="opacity-0"
        >
            <text
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
                x="50%"
                y="30%"
                fontSize="2rem"
                className="font-semibold uppercase opacity-0 transition-opacity duration-500"
                ref={textRef}
            >
                Улетел!
            </text>
            <text
                {...props}
                fill="#fff"
                fontSize="3rem"
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold leading-none transition-colors duration-500"
                ref={rateRef}
            >
                {rate.toFixed(2)}x
            </text>
        </g>
    );
};
