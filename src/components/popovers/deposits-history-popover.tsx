import { useGetAllDepositsQuery, Replenishment } from "@/store";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils";
import { formatDate, formatTime } from "@/utils/helpers";
import { usePopoverContext } from "@/components/ui/popover/use-popover-context";

interface PaymentHistoryPopoverProps extends React.HTMLAttributes<HTMLElement> {
    setInitialFormState: React.Dispatch<
        React.SetStateAction<{
            state: string;
            replenishmentId: string;
        }>
    >;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DepositsHistoryPopover: React.FC<PaymentHistoryPopoverProps> = ({
    className,
    setInitialFormState,
    setDialogOpen,
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
            <ScrollArea
                className={
                    deposits && deposits?.length >= 2 ? "h-64" : "h-auto"
                }
            >
                {isSuccess ? (
                    deposits.length !== 0 ? (
                        deposits.map((deposit, index) => (
                            <>
                                <PaymentDetails
                                    key={deposit?.createdAt}
                                    deposit={deposit}
                                    setInitialFormState={setInitialFormState}
                                    setDialogOpen={setDialogOpen}
                                />
                                {index !== deposits.length - 1 ? (
                                    <hr
                                        key={index}
                                        className="h-2"
                                    />
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
    setInitialFormState?: React.Dispatch<
        React.SetStateAction<{
            state: string;
            replenishmentId: string;
        }>
    >;
    setDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    deposit,
    setInitialFormState,
    setDialogOpen
}) => {
    // const showReplenishmentDetails = () => {};
    const { dialogRef } = usePopoverContext();

    return (
        <table className="w-full bg-slate-100 text-left text-sm">
            <tbody>
                <tr>
                    <td className="w-5/12 px-1.5 py-0.5">Дата создания</td>
                    <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                        {deposit?.createdAt
                            ? `${formatDate(deposit?.createdAt)} ${formatTime(
                                  deposit?.createdAt
                              )}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.completedDate
                            ? `${formatDate(
                                  deposit?.completedDate
                              )} ${formatTime(deposit?.completedDate)}`
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
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.amount} {deposit?.currency}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">{deposit?.status}</td>
                </tr>

                {deposit?.statusMessage ? (
                    <tr>
                        <td className="px-1.5 py-0.5">Причина отмены</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            {deposit?.statusMessage}
                        </td>
                    </tr>
                ) : null}
                <tr>
                    <td className="px-1.5 py-0.5 align-middle">
                        <span className="inline-block max-w-32 overflow-hidden text-ellipsis text-nowrap align-middle text-slate-500">
                            {`ID ${deposit?._id}`}
                        </span>
                    </td>
                    {deposit?.status === "Ожидает оплаты" ? (
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            <button
                                onClick={() => {
                                    if (deposit?.isPayConfirmed) {
                                        setInitialFormState?.(state => ({
                                            ...state,
                                            state: "confirmed",
                                            replenishmentId: deposit?._id
                                        }));
                                    } else {
                                        setInitialFormState?.(state => ({
                                            ...state,
                                            state: "second",
                                            replenishmentId: deposit?._id
                                        }));
                                    }
                                    setDialogOpen?.(true);
                                    dialogRef?.current?.close();
                                }}
                                className="text-right text-blue-500"
                            >
                                Открыть
                            </button>
                        </td>
                    ) : null}
                </tr>
            </tbody>
        </table>
    );
};
