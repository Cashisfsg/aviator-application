import { useState, useEffect } from "react";

interface TimerProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
    targetDate: string | undefined;
}

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTE_PER_HOUR = 60;

export const CountDownTimer: React.FC<TimerProps> = ({
    targetDate,
    ...props
}) => {
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });

    const timeString = `${
        time.minutes < 10 ? `0${time.minutes}` : time.minutes
    }:${time.seconds < 10 ? `0${time.seconds}` : time.seconds}`;

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = targetDate
                ? new Date(targetDate).getTime() - currentTime
                : 0;

            if (timeDifference <= 0) {
                clearInterval(timer);
                setTime(time => ({ ...time, minutes: 0, seconds: 0 }));
                return;
            }

            const minutes = Math.floor(
                (timeDifference %
                    (MILLISECONDS_PER_SECOND *
                        SECONDS_PER_MINUTE *
                        MINUTE_PER_HOUR)) /
                    (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)
            );
            const seconds = Math.floor(
                (timeDifference %
                    (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) /
                    MILLISECONDS_PER_SECOND
            );

            setTime(time => ({ ...time, minutes, seconds }));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <time
            {...props}
            dateTime={`PT${time.minutes}M${time.seconds}S`}
        >
            {timeString}
        </time>
    );
};
