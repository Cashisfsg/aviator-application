import { toast } from "sonner";
import { useGetAllDrawsQuery, useCancelDrawMutation, Draw } from "@/store";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";

import { cn } from "@/utils";
import { formatDate, formatTime } from "@/utils/helpers";

interface DrawHistoryPopoverProps extends React.HTMLAttributes<HTMLElement> {}

export const DrawHistoryPopover: React.FC<DrawHistoryPopoverProps> = ({
    className,
    ...props
}) => {
    const { data: draws, isSuccess } = useGetAllDrawsQuery();

    return (
        <section
            {...props}
            className={cn(
                "rounded-lg border border-green-50 bg-green-500 px-0 py-4 shadow-md",
                className
            )}
        >
            <ScrollArea
                className={draws && draws?.length >= 2 ? "h-64" : "h-auto"}
            >
                {isSuccess ? (
                    draws && draws.length !== 0 ? (
                        draws.map((draw, index) => (
                            <>
                                <PaymentDetails
                                    key={draw?._id}
                                    draw={draw}
                                />
                                {index !== draws.length - 1 ? (
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

interface DrawDetailsProps {
    draw?: Draw;
}

const PaymentDetails: React.FC<DrawDetailsProps> = ({ draw }) => {
    const [cancelDraw] = useCancelDrawMutation();

    const abortDraw = async (id: string | undefined) => {
        if (!id) return;

        const response = await cancelDraw({ id });

        if (response?.error) {
            toast(response?.error?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
        } else {
            toast(response?.data?.message, {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
        }
    };

    return (
        <table className="w-full bg-slate-100 text-left text-sm ">
            <tbody>
                <tr>
                    <td className="w-5/12 px-1.5 py-0.5">Дата создания</td>
                    <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                        {draw?.createdAt
                            ? `${formatDate(draw?.createdAt)} ${formatTime(
                                  draw?.createdAt
                              )}`
                            : ""}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.completedDate
                            ? `${formatDate(draw?.completedDate)} ${formatTime(
                                  draw?.completedDate
                              )}`
                            : ""}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.requisite.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.amount} {draw?.currency}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Реквизит</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        <ClipboardCopy
                            textToCopy={draw?.userRequisite}
                            toastMessage="Реквизиты скопированы в буфер обмена"
                            className="text-nowrap transition-colors mh:hover:text-slate-600"
                        >
                            {draw?.userRequisite}
                        </ClipboardCopy>
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">{draw?.status}</td>
                </tr>
                {draw?.statusMessage ? (
                    <tr>
                        <td className="px-1.5 py-0.5">Причина отмены</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            {draw?.statusMessage}
                        </td>
                    </tr>
                ) : null}
                <tr>
                    <td className="px-1.5 py-0.5">
                        <p className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={draw?._id}
                                className="inline-block max-w-[14ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {draw?._id || ""}
                            </ClipboardCopy>
                        </p>
                    </td>
                    {draw?.status === "Ожидает оплаты" ? (
                        <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                            <button
                                onClick={() => {
                                    abortDraw(draw?._id);
                                }}
                                className="text-right text-blue-500"
                            >
                                Отменить
                            </button>
                        </td>
                    ) : null}
                </tr>
            </tbody>
        </table>
    );
};
