const formatterUSD = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    maximumFractionDigits: 0
});

export const BetHistory = () => {
    return (
        <section>
            <h2 className="rounded-md border-2 border-gray-50 bg-gray-600 px-4 py-2 text-xl font-bold text-gray-300">
                История моих ставок
            </h2>
            <div className="px-4">
                <table className="w-full rounded-3xl leading-none">
                    <thead>
                        <tr className="text-base">
                            <th className="pb-6 pt-4">Время</th>
                            <th className="pb-6 pt-4">Ставка, USZ</th>
                            <th className="pb-6 pt-4">Коэфф.</th>
                            <th className="pb-6 pt-4">Выигрыш, USZ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(10)
                            .fill(0)
                            .map(_ => (
                                <tr
                                    key={_}
                                    className="bg-black-250 border-black-50 border-4"
                                >
                                    <td className="px-2 py-1 text-left text-xs">
                                        <p>15:15</p>
                                        <p>12.12.2022</p>
                                    </td>
                                    <td className="px-2 py-1 font-bold">
                                        {formatterUSD.format(15000)}
                                    </td>
                                    <td className="px-2 py-1">
                                        <span className="rounded-full border border-gray-50 px-2 py-1 text-sm">
                                            1.23x
                                        </span>
                                    </td>
                                    <td className="px-2 py-1 font-bold">
                                        {formatterUSD.format(18450)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
