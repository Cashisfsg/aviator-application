import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { BonusTable, DepositBonusTable } from "@/components/tables";

const bonusData = [
    { id: 1, date: new Date(), sum: 155254, ratio: 1.23 },
    { id: 2, date: new Date(), sum: 155254, ratio: 1.23 }
];

interface BonusAndPromoDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusAndPromoDialog: React.FC<BonusAndPromoDialogProps> = ({
    open,
    setOpen
}) => {
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
        >
            <DialogTrigger className="sr-only">
                Бонусы и промокоды
            </DialogTrigger>
            <DialogContent
                route={false}
                className="p-0 pb-4"
            >
                <section>
                    <header>
                        <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-center text-lg font-bold text-gray-300">
                            Бонусы
                        </h2>
                        <div className="flex items-end justify-between px-3 py-2 text-sm text-[#9ea0a3]">
                            <span>Список</span>
                            <ActivationBonusForm />
                        </div>
                    </header>

                    <BonusTable data={bonusData} />
                </section>

                <section>
                    <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-center text-lg font-bold text-gray-300">
                        Бонусы и промокоды
                    </h2>
                    <DepositBonusTable />
                </section>
            </DialogContent>
        </Dialog>
    );
};

const ActivationBonusForm = () => {
    const { toast } = useToast();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();

        const input = event.currentTarget.elements.namedItem(
            "promo"
        ) as HTMLInputElement;
        const promo = input.value;
        const date = new Date();

        if (promo === "") input.setAttribute("value", "Ввести промокод");

        bonusData.push({ id: 3, date: new Date(), sum: 123, ratio: 1 });
        input.setAttribute("type", "button");

        toast({
            title: "Промокод успешно активирован",
            description: `${date.toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })}, ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}`,
            action: (
                <ToastAction altText="Скрыть всплывающее окно">
                    Скрыть
                </ToastAction>
            )
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="basis-32 space-y-1 [&:has(input[type='button'])>button]:hidden"
        >
            <input
                type="button"
                name="promo"
                autoComplete="off"
                defaultValue="Ввести промокод"
                onClick={event => {
                    event.currentTarget.type = "text";
                    event.currentTarget.setAttribute("value", "");
                }}
                className="w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 focus-visible:outline-none [&type='text']:focus-visible:ring-0 [&type=button]:hover:bg-green-350 [&type=button]:active:translate-y-[1px] [&type=button]:active:border-[#1c7430]"
            />
            <button
                type="submit"
                className="w-full rounded-full border-2 border-gray-50 bg-[#2c2d30] text-center text-[10px] text-white"
            >
                Активировать
            </button>
        </form>
    );
};
