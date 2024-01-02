import {
    useGetAllDepositsQuery,
    useCancelReplenishmentByIdMutation,
    Replenishment
} from "@/store";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils";

interface PaymentHistoryPopoverProps
    extends React.HTMLAttributes<HTMLElement> {}

export const DepositsHistoryPopover: React.FC<PaymentHistoryPopoverProps> = ({
    className,
    ...props
}) => {
    const { data: deposits, isSuccess } = useGetAllDepositsQuery();

    return (
        <section
            {...props}
            className={cn(
                "w-72 rounded-lg border border-green-50 bg-green-500 px-0 py-4 shadow-md",
                className
            )}
        >
            <ScrollArea className={deposits?.length !== 0 ? "h-64" : "h-auto"}>
                {isSuccess ? (
                    deposits.length !== 0 ? (
                        deposits.map((deposit, index) => (
                            <>
                                <PaymentDetails
                                    key={deposit?.createdAt}
                                    deposit={deposit}
                                />
                                {index !== deposits.length ? (
                                    <hr className="h-2" />
                                ) : null}
                            </>
                        ))
                    ) : (
                        <PaymentDetails />
                    )
                ) : null}
            </ScrollArea>
        </section>
    );
};

interface PaymentDetailsProps {
    deposit?: Replenishment;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ deposit }) => {
    const [cancelDeposit] = useCancelReplenishmentByIdMutation();
    const { toast } = useToast();

    const abortDeposit = async () => {
        const response = await cancelDeposit({ id: 2 });

        if (response?.error) return;

        const date = new Date();

        toast({
            title: response?.data?.message,
            description: `${date.toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })}, ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}`,
            duration: 5000,
            action: (
                <ToastAction altText="Скрыть всплывающее окно">
                    Скрыть
                </ToastAction>
            )
        });
    };

    return (
        <table className="w-full bg-slate-100 text-left text-sm">
            <tbody>
                <tr>
                    <td className="px-1.5 py-0.5">Дата создания</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.createdAt
                            ? new Date(deposit?.createdAt).toLocaleDateString()
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.completedDate
                            ? new Date(
                                  deposit?.completedDate
                              ).toLocaleDateString()
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.requisite.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">{deposit?.status}</td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.amount} {deposit?.currency}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Реквизит</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.requisite.requisite}
                    </td>
                </tr>
                {deposit?.isPayConfirmed ? (
                    <tr>
                        <td className="px-1.5 py-0.5">ID 1234</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            <button
                                onClick={abortDeposit}
                                className="text-right text-blue-500"
                            >
                                Отменить
                            </button>
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    );
};
