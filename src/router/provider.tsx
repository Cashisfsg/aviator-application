import {
    createBrowserRouter,
    RouterProvider as Provider
} from "react-router-dom";
import { SignInModal } from "@/containers/header/components/modals/sign-in-modal";
import { SignUpModal } from "@/containers/header/components/modals/sign-up-modal";
import { RestorePasswordModal } from "@/containers/header/components/modals/restore-password-modal";
import {
    RestorePasswordForm,
    action as restorePasswordAction
} from "@/containers/header/components/form/restore-password-form";
import {
    ConfirmEmailForm,
    action as confirmEmailAction
} from "@/containers/header/components/form/confirm-email-form";
import {
    ResetPasswordForm,
    action as resetPasswordAction
} from "@/containers/header/components/form/reset-password-form";

const router = createBrowserRouter([
    {
        path: "aviator_front",
        async lazy() {
            return import("@/containers/layout").then(module => ({
                Component: module.Layout
            }));
        },
        children: [
            {
                index: true,
                element: <SignInModal />
            },
            {
                path: "sign-up",
                element: <SignUpModal />
            },
            {
                path: "password",
                element: <RestorePasswordModal />,
                children: [
                    {
                        path: "restore",
                        element: <RestorePasswordForm />,
                        action: restorePasswordAction
                    },
                    {
                        path: "confirm-email",
                        element: <ConfirmEmailForm />,
                        action: confirmEmailAction
                    },
                    {
                        path: "reset",
                        element: <ResetPasswordForm />,
                        action: resetPasswordAction
                    }
                ]
            }
        ]
    }
]);

export const ReactRouterProvider = () => {
    return <Provider router={router} />;
};
