import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import { useActivatePromoCodeMutation } from "@/store";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { BonusTable, DepositBonusTable } from "@/components/tables";

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
                            <ActivationBonusForm />
                        </div>
                    </header>

                    <BonusTable />
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

interface FormFields {
    promoCode: HTMLInputElement;
}

const ActivationBonusForm = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [activatePromo] = useActivatePromoCodeMutation();

    const { toast } = useToast();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        const { promoCode } = event.currentTarget;
        const promo = promoCode.value;

        // if (promo.trim() === "") {
        //     promoCode.setAttribute("value", "Ввести промокод");
        //     return;
        // }

        const response = await activatePromo({ promoCode: promo });

        promoCode.setAttribute("type", "button");
        buttonRef.current?.setAttribute("disabled", "");

        if (response?.error) {
            toast({
                title: response?.error?.data?.message,
                duration: 5000
            });
        } else {
            toast({
                title: "Промокод успешно активирован",
                duration: 5000
            });
        }
    };

    const onClickHandler: React.MouseEventHandler<HTMLInputElement> = event => {
        event.currentTarget.type = "text";
        event.currentTarget.setAttribute("defaultValue", "");
        event.currentTarget.setAttribute("value", "");
        buttonRef.current?.removeAttribute("disabled");
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
                onClick={onClickHandler}
                className="w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 focus-visible:outline-none group-has-[input[type=button]:active]:translate-y-[1px] group-has-[input[type=button]:active]:border-[#1c7430] group-has-[input[type=button]:hover]:bg-green-350"
            />
            <button
                type="submit"
                disabled
                ref={buttonRef}
                className="w-full rounded-full border-2 border-gray-50 bg-[#2c2d30] text-center text-[10px] text-white disabled:pointer-events-none disabled:hidden"
            >
                Активировать
            </button>
        </form>
    );
};
