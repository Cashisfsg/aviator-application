import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import Visa from "@/assets/visa-360w.webp";

interface PaymentDrawFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PaymentDrawForm: React.FC<PaymentDrawFormProps> = ({
    setOpen
}) => {
    const { toast } = useToast();

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                setOpen(false);
                const date = new Date();
                toast({
                    title: "Заявка на вывод успешно создана",
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
            }}
            className="grid gap-y-4 "
        >
            <p className="flex h-10 justify-center rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={Visa}
                    alt=""
                    className="h-full"
                />{" "}
                {/* <span className="">Qiwi кошелёк</span> */}
            </p>
            <Label className="text-sm text-slate-400">
                <span className="text-left ">Введите реквизиты для вывода</span>
                <Input
                    inputMode="numeric"
                    className="border-none bg-slate-300/70 text-center leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                />
            </Label>
            <Label className="text-sm text-slate-400">
                <span className="">Введите сумму</span>
                <Input
                    inputMode="numeric"
                    className="border-none bg-slate-300/70 text-center leading-none text-black shadow-md focus-visible:outline-slate-400/70"
                />
            </Label>

            <button className="mt-4 rounded-md bg-lime-500 px-4 py-2 leading-none text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5">
                Подтвердить
            </button>
        </form>
    );
};
