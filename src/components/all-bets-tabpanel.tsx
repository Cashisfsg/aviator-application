import { useState, useEffect } from "react";
import {
    useGetUserBalanceQuery,
    useLazyGetPreviousRoundInfoQuery,
    useStateSelector,
    selectGameDetails,
    selectSocket,
    PreviousRoundInfoResponse
} from "@/store";

import { Table, Row, Cell } from "@/components/ui/table";

import Avatar from "@/assets/avatar-360w.webp";

interface PreviousRoundData {
    data: PreviousRoundInfoResponse[];
    enabled: boolean;
}

export const AllBetsTabpanel = () => {
    const [previousRoundData, setPreviousRoundData] =
        useState<PreviousRoundData>({
            data: [],
            enabled: false
        });
    const { data: balance, isSuccess } = useGetUserBalanceQuery();
    const gameDetails = useStateSelector(state => selectGameDetails(state));
    const socket = useStateSelector(state => selectSocket(state));
    const [getPreviousRoundInfo] = useLazyGetPreviousRoundInfoQuery();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        if (previousRoundData.enabled) {
            setPreviousRoundData(previousData => ({
                ...previousData,
                enabled: false
            }));
            return;
        }

        if (previousRoundData.data.length !== 0) {
            setPreviousRoundData(previousData => ({
                ...previousData,
                enabled: true
            }));
            return;
        }

        try {
            const data = await getPreviousRoundInfo().unwrap();

            console.log("Data");
            console.log(data);

            setPreviousRoundData(previousData => ({
                ...previousData,
                data: data,
                enabled: true
            }));
        } catch (error) {}
    };

    console.log("Previous round data");
    console.log(previousRoundData);
    console.log(gameDetails);

    useEffect(() => {
        const roundEndHandler = () => {
            setPreviousRoundData(previousData => ({
                ...previousData,
                data: [],
                enabled: false
            }));
        };

        socket.on("crash", roundEndHandler);

        return () => socket.off("crash", roundEndHandler);
    }, []);

    return (
        <>
            <button
                onClick={onClickHandler}
                className="ml-auto flex items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2 py-1 text-xs leading-none text-[#767b85] mh:hover:text-[#e50539]"
            >
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
                <span className="text-[#9ea0a3]">
                    {previousRoundData.enabled ? "Текущий" : "Предыдущий"}
                </span>
            </button>

            <Table
                headers={["Кол-во ставок", "Сумма ставок", "Сумма выигрыша"]}
                data={[
                    [
                        gameDetails.currentPlayers?.length,
                        `${gameDetails?.betAmount?.toFixed(2) || "0.00"} ${
                            balance?.currency || "USD"
                        }`,
                        `${gameDetails?.winAmount?.toFixed(2) || "0.00"} ${
                            balance?.currency || "USD"
                        }`
                    ]
                ]}
                renderData={data => (
                    <>
                        {data.map((row, i) => (
                            <Row key={i}>
                                {row.map((cell, j) => (
                                    <Cell key={j}>{cell}</Cell>
                                ))}
                            </Row>
                        ))}
                    </>
                )}
            />
            {isSuccess ? (
                <Table
                    headers={["Игрок", "Ставка", "Коэф.", "Выигрыш"]}
                    data={
                        previousRoundData.enabled
                            ? previousRoundData.data
                            : gameDetails.currentPlayers
                    }
                    renderData={data => (
                        <>
                            {data.map((player, i) => (
                                <Row
                                    key={i}
                                    className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
                                        isNaN(
                                            player?.win?.[
                                                balance?.currency
                                            ] as number
                                        )
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
                                            )}***${player?.playerLogin?.at(
                                                -1
                                            )}`}
                                        </span>
                                    </Cell>
                                    <Cell>{`${player?.bet?.[
                                        balance?.currency
                                    ].toFixed(2)} ${balance?.currency}`}</Cell>
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
                                        {!isNaN(
                                            player?.win?.[
                                                balance?.currency
                                            ] as number
                                        )
                                            ? `${player?.win?.[
                                                  balance?.currency
                                              ].toFixed(
                                                  2
                                              )} ${balance?.currency}`
                                            : "-"}
                                    </Cell>
                                </Row>
                            ))}
                        </>
                    )}
                />
            ) : null}
            {!gameDetails ||
            gameDetails?.currentPlayers.length === 0 ||
            previousRoundData.data.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
