import { Table, Row, Cell } from "@/components/ui/table";
import { Currency, Player } from "@/store";

import Avatar from "@/assets/avatar-360w.webp";

interface PlayersListProps {
    players: Player[];
    currency: Currency;
}

export const PlayersList: React.FC<PlayersListProps> = ({
    players,
    currency
}) => {
    return (
        <Table
            headers={["Игрок", "Ставка", "Коэф.", "Выигрыш"]}
            data={players}
            renderData={data => (
                <>
                    {data.map((player, i) => (
                        <Row
                            key={i}
                            className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
                                isNaN(player?.win?.[currency] as number)
                                    ? ""
                                    : "[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                            }`}
                        >
                            <Cell className="flex items-center gap-x-2">
                                <img
                                    src={player.profileImage || Avatar}
                                    alt="User avatar image"
                                    height="30"
                                    width="30"
                                    loading="lazy"
                                    className="rounded-full"
                                />
                                <span className="text-[#9ea0a3]">
                                    {`${player?.playerLogin?.at(
                                        0
                                    )}***${player?.playerLogin?.at(-1)}`}
                                </span>
                            </Cell>
                            <Cell>{`${player?.bet?.[currency].toFixed(
                                2
                            )} ${currency}`}</Cell>
                            <Cell>
                                {!isNaN(player?.coeff as number) ? (
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                        {player?.coeff}x
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </Cell>
                            <Cell>
                                {!isNaN(player?.win?.[currency] as number)
                                    ? `${player?.win?.[currency].toFixed(
                                          2
                                      )} ${currency}`
                                    : "-"}
                            </Cell>
                        </Row>
                    ))}
                </>
            )}
        />
    );
};
