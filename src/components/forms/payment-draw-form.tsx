import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PaymentDrawForm = () => {
    return (
        <form
            id="payment-draw-form"
            // popover="auto"
            className="space-y-4 rounded-2.5xl border border-gray-50 px-2 py-4 shadow-lg"
        >
            {/* <select>
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </select> */}
            <Label className="flex-col">
                <span className="text-left">Введите реквизиты для вывода</span>
                <Input />
            </Label>
            <Label className="flex-col">
                <span className="justify-self-start">Введите сумму</span>
                <Input inputMode="numeric" />
            </Label>
        </form>
    );
};
