import { useGetAllDrawsQuery, useCancelDrawMutation, Draw } from "@/store";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils";

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
                "w-72 rounded-lg border border-green-50 bg-green-500 px-0 py-4 shadow-md",
                className
            )}
        >
            <ScrollArea className={draws?.length !== 0 ? "h-64" : "h-auto"}>
                {isSuccess ? (
                    draws.length !== 0 ? (
                        draws.map((draw, index) => (
                            <>
                                <PaymentDetails
                                    key={draw?.createdAt}
                                    draw={draw}
                                />
                                {index !== draws.length ? (
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

interface DrawDetailsProps {
    draw?: Draw;
}

const PaymentDetails: React.FC<DrawDetailsProps> = ({ draw }) => {
    const [cancelDraw] = useCancelDrawMutation();
    const { toast } = useToast();

    const abortDraw = async () => {
        const response = await cancelDraw({ id: 2 });

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
        <table className="w-full bg-white text-left text-sm">
            <tbody>
                <tr>
                    <td className="px-1.5 py-0.5">Дата создания</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.createdAt
                            ? new Date(draw?.createdAt).toLocaleDateString()
                            : null}{" "}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.completedDate
                            ? new Date(draw?.completedDate).toLocaleDateString()
                            : null}{" "}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {draw?.requisite.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">{draw?.status}</td>
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
                        {draw?.requisite.requisite}
                    </td>
                </tr>
                {draw?.status === "Ожидает оплаты" ? (
                    <tr>
                        <td className="px-1.5 py-0.5">ID 1234</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            <button
                                onClick={abortDraw}
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
