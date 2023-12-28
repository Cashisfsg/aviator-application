import { useGetAllReplenishmentsQuery } from "@/store";

import { cn } from "@/utils";

interface PaymentHistoryPopoverProps
    extends React.HTMLAttributes<HTMLElement> {}

export const PaymentHistoryPopover: React.FC<PaymentHistoryPopoverProps> = ({
    className,
    ...props
}) => {
    const data = useGetAllReplenishmentsQuery();

    console.log("replenishments", data);

    return (
        <section
            {...props}
            className={cn(
                "w-72 rounded-lg border border-green-50 bg-green-500 px-0 py-4 shadow-md",
                className
            )}
        >
            <PaymentDetails />
            <hr className="h-2" />
            <PaymentDetails />
        </section>
    );
};

const PaymentDetails = () => {
    return (
        <table className="w-full bg-white text-left text-sm">
            <tbody>
                <tr>
                    <td className="px-1.5 py-0.5">Дата создания</td>
                    <td className="px-1.5 py-0.5">
                        {new Date().toLocaleDateString()}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="px-1.5 py-0.5">
                        {new Date().toLocaleDateString()}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="px-1.5 py-0.5">UzCard</td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="px-1.5 py-0.5">В обработке</td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="px-1.5 py-0.5">50 500 UZS</td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Реквизит</td>
                    <td className="px-1.5 py-0.5">4239842394293472</td>
                </tr>
            </tbody>
        </table>
    );
};
