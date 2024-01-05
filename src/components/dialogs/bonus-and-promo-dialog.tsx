import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { BonusTable, DepositBonusTable } from "@/components/tables";
import { useActivatePromoCodeMutation } from "@/store";

interface Bonus {
    id: number;
    date: Date;
    sum: number;
    ratio: number;
}
interface BonusAndPromoDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusAndPromoDialog: React.FC<BonusAndPromoDialogProps> = ({
    open,
    setOpen
}) => {
    const [bonusData, setBonusData] = useState<Bonus[]>([
        { id: 1, date: new Date(), sum: 155254, ratio: 1.23 },
        { id: 2, date: new Date(), sum: 155254, ratio: 1.23 }
    ]);

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
                // onInteractOutside={event => event.preventDefault()}
                className="p-0 pb-4"
            >
                <section>
                    <header>
                        <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-center text-lg font-bold text-gray-300">
                            Бонусы
                        </h2>
                        <div className="flex items-end justify-between px-3 py-2 text-sm text-[#9ea0a3]">
                            <span>Список</span>
                            <ActivationBonusForm setBonusData={setBonusData} />
                        </div>
                    </header>

                    <BonusTable data={bonusData} />
                </section>

                <section>
                    <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-center text-lg font-bold text-gray-300">
                        Бонусы на пополнение
                    </h2>
                    <DepositBonusTable />
                </section>
            </DialogContent>
        </Dialog>
    );
};

interface ActivationFormProps {
    setBonusData: React.Dispatch<React.SetStateAction<Bonus[]>>;
}

interface FormFields {
    promoCode: HTMLInputElement;
}

const ActivationBonusForm = ({ setBonusData }: ActivationFormProps) => {
    const [activatePromo] = useActivatePromoCodeMutation();

    const { toast } = useToast();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { promoCode } = event.currentTarget;
        const promo = promoCode.value;
        const date = new Date();

        if (promo.trim() === "")
            promoCode.setAttribute("value", "Ввести промокод");

        const response = await activatePromo({ promoCode: promo });

        promoCode.setAttribute("type", "button");

        if (response?.error) {
            toast({
                title: response?.error?.data?.message,
                duration: 5000
            });
        } else {
            setBonusData(bonusData => {
                return [
                    ...bonusData,
                    { id: 3, date: date, sum: 123, ratio: 1 }
                ];
            });
            toast({
                title: "Промокод успешно активирован",
                duration: 5000
            });
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="group basis-32 space-y-1"
        >
            <input
                type="button"
                name="promoCode"
                required
                autoComplete="off"
                defaultValue="Ввести промокод"
                onClick={event => {
                    event.currentTarget.type = "text";
                    event.currentTarget.setAttribute("defaultValue", "");
                    event.currentTarget.setAttribute("value", "");
                }}
                className="w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 focus-visible:outline-none [&type='text']:focus-visible:ring-0 [&type=button]:hover:bg-green-350 [&type=button]:active:translate-y-[1px] [&type=button]:active:border-[#1c7430]"
            />
            <button
                type="submit"
                className="w-full rounded-full border-2 border-gray-50 bg-[#2c2d30] text-center text-[10px] text-white group-has-[input[type=button]]:hidden"
            >
                Активировать
            </button>
        </form>
    );
};
