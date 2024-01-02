import { useState, useEffect } from "react";

import { Table, Row, Cell } from "@/components/ui/table";
import { socket } from "@/components/socket/socket";
import { Player } from "./socket/types";

export const AllBetsTabpanel = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        socket.on("game", data => {
            console.log("game being started");

            // setPlayers(data.currentPlayers);
        });
    }, []);

    return (
        <>
            <button className="ml-auto flex items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2 py-1 text-xs leading-none text-[#767b85] hover:text-[#e50539]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                >
                    <path
                        d="M7.688.27a6.615 6.615 0 0 0-5.809 3.4L.25 2.043v4.604h4.604L2.871 4.662c.92-1.77 2.692-2.974 4.816-2.974C10.592 1.688 13 4.095 13 7c0 2.904-2.408 5.313-5.313 5.313-2.337 0-4.25-1.488-5.029-3.542H1.171c.779 2.833 3.4 4.958 6.517 4.958 3.754 0 6.729-3.046 6.729-6.729 0-3.683-3.046-6.73-6.73-6.73zM6.625 3.813v3.613l3.33 1.983.566-.92-2.834-1.7V3.811H6.625z"
                        fill="currentColor"
                        fillRule="nonzero"
                    />
                </svg>
                <span className="text-[#9ea0a3]">Предыдущий</span>
            </button>

            <Table
                headers={["Кол-во ставок", "Сумма ставок", "Сумма выигрыша"]}
                data={[["2554", "5545 $", "1551 $"]]}
                renderData={data => (
                    <>
                        {data.map(row => (
                            <Row>
                                {row.map(cell => (
                                    <Cell>{cell}</Cell>
                                ))}
                            </Row>
                        ))}
                    </>
                )}
            />

            <Table
                headers={["Игрок", "Ставка", "Коэф.", "Выигрыш"]}
                data={players}
                renderData={data => (
                    <>
                        {data.map(row => (
                            <Row
                                key={row.playerLogin}
                                className="[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                            >
                                <Cell className="flex items-center gap-x-2">
                                    <img
                                        src="https://www.shareicon.net/data/1024x1024/2016/11/01/849379_man_1024x1024.png"
                                        alt="User avatar image"
                                        height="30"
                                        width="30"
                                    />
                                    <span className="text-[#9ea0a3]">
                                        {row.playerLogin}
                                    </span>
                                </Cell>
                                <Cell>{row.bet} $</Cell>
                                <Cell>
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold">
                                        {row.coeff}x
                                    </span>
                                </Cell>
                                <Cell>{row.win} $</Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
        </>
    );
};
