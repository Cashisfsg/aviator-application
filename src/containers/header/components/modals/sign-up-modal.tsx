// import { Dialog } from "@/components/ui/dialog/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignUpForm } from "../form/sign-up-form";

export const SignUpModal = () => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Регистрация</DialogTitle>
                {/* <Dialog.Description className="text-center">
                            Добро пожаловать в игру Aviator
                        </Dialog.Description> */}
            </DialogHeader>
            {/* <Dialog.Close /> */}

            <SignUpForm />
        </>
    );
};
