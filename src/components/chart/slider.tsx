import { useLayoutEffect, useRef } from "react";

interface SliderProps extends React.SVGAttributes<SVGSVGElement> {
    isVisible: boolean;
}

export const Slider: React.FC<SliderProps> = ({ isVisible, ...props }) => {
    const animateRef = useRef<SVGAnimateElement>(null);

    useLayoutEffect(() => {
        if (!isVisible) return;
        console.log("Start animation");

        animateRef?.current?.beginElement();

        console.log(animateRef.current);
    }, [isVisible]);

    return (
        <>
            <svg
                {...props}
                id="slider"
                width="130"
                height="6"
                fill="none"
                stroke="none"
            >
                <g>
                    <rect
                        x="0"
                        y="0"
                        height="100%"
                        width="100%"
                        rx="3"
                        // fill="#fff"
                        className="slider-bar"
                    />
                    <rect
                        x="0"
                        y="0"
                        rx="3"
                        // cx="100%"
                        width="130"
                        fill="#e50539"
                        className="slider"
                    >
                        <animate
                            ref={animateRef}
                            attributeName="width"
                            attributeType="XML"
                            from="130"
                            to="0"
                            // values="100%; 0"
                            dur="4.4s"
                            // begin="0s"
                            repeatCount="1"
                            fill="freeze"
                            restart="always"
                        />
                    </rect>
                </g>
            </svg>
        </>
    );
};
