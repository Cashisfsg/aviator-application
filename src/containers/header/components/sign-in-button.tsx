import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// import { Dialog } from "@/components/ui/dialog/dialog";

export const SignInButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Link
                    to="/aviator_front/main/sign-in"
                    className="rounded-lg bg-green-400 px-4 py-3 font-bold"
                >
                    Вход
                </Link>
            </DialogTrigger>
            <DialogContent className="w-80" />
        </Dialog>
    );
};

// export const SignInButton = () => {
//     const navigate = useNavigate();

//     return (
//         <Dialog>
//             <Dialog.Trigger
//                 className="rounded-lg bg-green-400 px-4 py-3 font-bold"
//                 onClick={() => navigate("/aviator_front/main/sign-in")}
//             >
//                 Вход
//             </Dialog.Trigger>
//             <Dialog.Portal>
//                 <Dialog.Content className="w-80 space-y-4 text-white"></Dialog.Content>
//             </Dialog.Portal>
//         </Dialog>
//     );
// };
