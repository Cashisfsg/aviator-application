export const AllBets = () => {
    return (
        <>
            <table className="w-full">
                <caption>
                    <table className="w-full">
                        <caption className="text-right">
                            <button className="bg-black rounded-full px-4 py-1">
                                Предыдущий
                            </button>
                        </caption>
                        <thead>
                            <tr>
                                <th>Кол-во ставок</th>
                                <th>Сумма ставок</th>
                                <th>Сумма вигрыша</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>2554</td>
                                <td>5545 $</td>
                                <td>1551 $</td>
                            </tr>
                        </tbody>
                    </table>
                </caption>
                <thead>
                    <tr className="">
                        <th>Игрок</th>
                        <th>Ставка</th>
                        <th>Коэф.</th>
                        <th>Выигрыш</th>
                    </tr>
                </thead>
                <tbody>
                    {Array(10)
                        .fill(0)
                        .map(_ => (
                            <tr
                                key={_}
                                className="py-0.5"
                            >
                                <td className="bg-black flex items-center gap-2 rounded-l-full px-4">
                                    <img
                                        src="https://www.shareicon.net/data/1024x1024/2016/11/01/849379_man_1024x1024.png"
                                        alt=""
                                        width={48}
                                        height={48}
                                    />
                                    <span>d***5</span>
                                </td>
                                <td className="bg-black">100 $</td>
                                <td className="bg-black">-</td>
                                <td className="bg-black rounded-r-full">-</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
};
