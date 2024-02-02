// import { Dialog, DialogContent } from "@/components/ui/dialog";

import * as Dialog from "@radix-ui/react-dialog";
import { PaymentDepositForm } from "@/components/forms";
import { X } from "lucide-react";

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
        <Dialog.Root
            modal={false}
            open={open}
            onOpenChange={setOpen}
        >
            <Dialog.Portal>
                <Dialog.Content className="fixed left-[50%] top-[50%] isolate z-30 grid w-80 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2.5xl border border-slate-200 bg-slate-100 p-6 text-black-50 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <PaymentDepositForm
                        initialFormState={initialFormState}
                        selectedRequisiteId={selectedRequisiteId}
                    />
                    <Dialog.Close className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
