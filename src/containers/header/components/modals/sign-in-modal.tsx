import { Link } from "react-router-dom";

import {
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
// import { Dialog } from "@/components/ui/dialog/dialog";

import { SignInForm } from "../form/sign-in-form";

export const SignInModal = () => {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center text-2xl">Вход</DialogTitle>
                <DialogDescription className="text-center">
                    Добро пожаловать в игру Aviator
                </DialogDescription>
            </DialogHeader>
            <SignInForm />
            <p className="text-center text-sm">
                <span className="text-xs">Ещё нет аккаунта</span>
                <br />
                <Link
                    to="/aviator_front/main/sign-up"
                    className="text-blue-500"
                >
                    Зарегистрироваться
                </Link>
            </p>
        </>
    );
};

// export const SignInModal = () => {
//     return (
//         <>
//             <Dialog.Header>
//                 <Dialog.Title>Вход</Dialog.Title>
//                 <Dialog.Description className="text-center">
//                     Добро пожаловать в игру Aviator
//                 </Dialog.Description>
//             </Dialog.Header>
//             <Dialog.Close />

//             <SignInForm />
//             <p className="text-center text-sm">
//                 <span className="text-xs">Ещё нет аккаунта</span>
//                 <br />
//                 <Link
//                     to="/aviator_front/main/sign-up"
//                     className="text-blue-500"
//                 >
//                     Зарегистрироваться
//                 </Link>
//             </p>
//         </>
//     );
// };
