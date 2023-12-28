import { useNavigate, Outlet } from "react-router-dom";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog/dialog";

// export const SignUpButton = () => {
//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Link
//                     to="/aviator_front/main/sign-up"
//                     className="rounded-lg bg-red-400 px-4 py-3 font-bold"
//                 >
//                     Регистрация
//                 </Link>
//             </DialogTrigger>
//             <DialogContent className="w-80 bg-black-50" />
//         </Dialog>
//     );
// };

export const SignUpButton = () => {
    const navigate = useNavigate();

    return (
        <Dialog>
            <Dialog.Trigger
                className="rounded-lg bg-red-400 px-4 py-3 font-bold"
                onClick={() => navigate("/aviator_front/main/sign-up")}
            >
                Регистрация
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Content className="hide-scrollbar w-80 space-y-4 text-white">
                    <Dialog.Header>
                        <Dialog.Title>Регистрация</Dialog.Title>
                        {/* <Dialog.Description className="text-center">
                            Добро пожаловать в игру Aviator
                        </Dialog.Description> */}
                    </Dialog.Header>
                    <Dialog.Close />

                    <Outlet />
                    {/* <p className="text-center text-sm">
                        <span className="text-xs">Ещё нет аккаунта</span>
                        <br />
                        <Link
                            to="/aviator_front/main/sign-up"
                            className="text-blue-500"
                        >
                            Зарегистрироваться
                        </Link>
                    </p> */}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
};
