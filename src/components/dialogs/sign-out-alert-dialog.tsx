import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useAppDispatch, userApi, replenishmentApi, logout } from "@/store";

interface SignOutAlertDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignOutAlertDialog: React.FC<SignOutAlertDialogProps> = ({
    open,
    setOpen
}) => {
    const dispatch = useAppDispatch();

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger className="sr-only">Выйти</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы действительно хотите выйти?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Нет</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            dispatch(logout());
                            dispatch(userApi.util.resetApiState());
                            dispatch(replenishmentApi.util.resetApiState());
                        }}
                    >
                        Да
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
