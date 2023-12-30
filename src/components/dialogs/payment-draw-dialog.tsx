import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PaymentDrawForm } from "@/components/forms";

interface PaymentDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRequisiteId: string | null;
}

export const PaymentDrawDialog: React.FC<PaymentDialogProps> = ({
    open,
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
                <PaymentDrawForm
                    setOpen={setOpen}
                    selectedRequisiteId={selectedRequisiteId}
                />
            </DialogContent>
        </Dialog>
    );
};
