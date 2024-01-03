import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PaymentDepositForm } from "@/components/forms";

interface PaymentDialogProps {
    open: boolean;
    initialFormState: {
        state: string;
        replenishmentId: string;
    };
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRequisiteId: string;
}

export const PaymentDepositDialog: React.FC<PaymentDialogProps> = ({
    open,
    initialFormState,
    setOpen,
    selectedRequisiteId
}) => {
    return (
        <Dialog
            modal={false}
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent
                route={false}
                className="w-80 border-slate-200 bg-slate-100 text-black-50"
            >
                <PaymentDepositForm
                    initialFormState={initialFormState}
                    selectedRequisiteId={selectedRequisiteId}
                />
            </DialogContent>
        </Dialog>
    );
};
