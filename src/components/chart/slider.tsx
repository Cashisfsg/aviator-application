interface SliderProps extends React.SVGAttributes<SVGSVGElement> {}

export const Slider: React.FC<SliderProps> = ({ ...props }) => {
    return (
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
                    fill="#fff"
                />
                <rect
                    x="0"
                    y="0"
                    // height="100%"
                    rx="3"
                    fill="#e50539"
                    className="slider"
                />
            </g>
        </svg>
    );
};
