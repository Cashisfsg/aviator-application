import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useAppDispatch, userApi, baseReplenishmentApi, logout } from "@/store";

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
                            dispatch(baseReplenishmentApi.util.resetApiState());
                        }}
                    >
                        Да
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
