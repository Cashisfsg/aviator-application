import { ActivationBonusForm } from "../forms";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

                    <BonusTable setOpen={setOpen} />
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
