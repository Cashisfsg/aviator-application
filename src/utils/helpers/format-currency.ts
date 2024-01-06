export const formatCurrency = (currency: number) => {
    const formatterUSD = new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });

    return formatterUSD.format(currency);
};
