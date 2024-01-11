import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
    className?: string;
    hasNextPage: boolean;
    callback?: () => void;
    children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    className,
    hasNextPage,
    callback,
    children
}) => {
    const { ref } = useInView({
        threshold: 1,
        skip: !hasNextPage,
        initialInView: true,
        onChange(inView) {
            if (!inView) return;

            callback?.();
        }
    });

    return (
        <div className={className}>
            {children}

            <div
                ref={ref}
                className="invisible h-3"
            />
        </div>
    );
};
