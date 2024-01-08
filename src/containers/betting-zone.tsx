import { Bet } from "@/components/bet";

export const BettingZone = () => {
    return (
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Bet betNumber={1} />
            <Bet betNumber={2} />
        </section>
    );
};
