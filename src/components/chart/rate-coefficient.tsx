import {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle
} from "react";

import { socket } from "@/components/socket/socket";

export interface RateElement extends React.SVGAttributes<SVGTextElement> {
    startAnimation: () => void;
    stopAnimation: () => void;
    resetAnimation: () => void;
}

export const RateCoefficient = forwardRef<RateElement>(({ ...props }, ref) => {
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [value, setValue] = useState(1);
    const groupRef = useRef<SVGGElement>(null);
    const textRef = useRef<SVGTextElement>(null);
    const rateRef = useRef<SVGTextElement>(null);

    // useEffect(() => {
    //     if (!isAnimationPlaying) return;

    //     const timeout = setInterval(() => {
    //         setValue(value => +(value + 0.01).toFixed(2));
    //     }, 80);

    //     return () => clearInterval(timeout);
    // }, [isAnimationPlaying]);

    useEffect(() => {
        socket.on("game", data => {
            setValue(data.x.toFixed(2));
        });
    }, [isAnimationPlaying]);

    useImperativeHandle(
        ref,
        () => ({
            startAnimation: () => {
                groupRef.current?.classList.replace("opacity-0", "opacity-100");
                setIsAnimationPlaying(true);
            },
            stopAnimation: () => {
                textRef.current?.classList.replace("opacity-0", "opacity-100");
                rateRef.current?.setAttribute("fill", "#e50539");
                setIsAnimationPlaying(false);
            },
            resetAnimation: () => {
                groupRef.current?.classList.replace("opacity-100", "opacity-0");
                textRef.current?.classList.replace("opacity-100", "opacity-0");
                rateRef.current?.setAttribute("fill", "#fff");
                setValue(0);
            }
        }),
        []
    );

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
                {value}x
            </text>
        </g>
    );
});
