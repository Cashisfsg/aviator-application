import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    useFetchAllReplenishmentsQuery,
    Replenishment
} from "@/api/replenishment";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils";
import { formatDate, formatTime } from "@/utils/helpers";
import { usePopoverContext } from "@/components/ui/popover/use-popover-context";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";

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
    const { data: replenishments, isSuccess } =
        useFetchAllReplenishmentsQuery();

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
                    replenishments && replenishments?.length >= 2
                        ? "h-64"
                        : "h-auto"
                }
            >
                {isSuccess ? (
                    replenishments && replenishments.length !== 0 ? (
                        replenishments.map((deposit, index) => (
                            <div key={deposit?._id}>
                                <PaymentDetails
                                    deposit={deposit}
                                    setInitialFormState={setInitialFormState}
                                    setDialogOpen={setDialogOpen}
                                />
                                {index !== replenishments.length - 1 ? (
                                    <hr
                                        key={index}
                                        className="h-2"
                                    />
                                ) : null}
                            </div>
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
    const { data: balance } = useGetUserBalanceQuery();

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
                        {deposit?.requisite?.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {deposit?.amount?.[balance?.currency]
                            ? `${deposit?.amount?.[balance?.currency].toFixed(
                                  2
                              )} ${balance?.currency}`
                            : null}
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
                        <p className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(deposit?.uid)}
                                className="inline-block max-w-[14ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {deposit?.uid || ""}
                            </ClipboardCopy>
                        </p>
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
