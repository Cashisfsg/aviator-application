export const formatCurrency = (currency: number) => {
    const formatterUSD = new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        maximumFractionDigits: 0
    });

    return formatterUSD.format(currency);
};
