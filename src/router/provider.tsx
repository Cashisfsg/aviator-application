import {
    createBrowserRouter,
    RouterProvider as Provider,
    Navigate
} from "react-router-dom";

import { MainPage, PaymentDrawPage, PaymentReplenishmentPage } from "@/pages";
import { PrivateRoute } from "./private-outlet";

import { SignInModal } from "@/containers/header/components/modals/sign-in-modal";
import { SignUpModal } from "@/containers/header/components/modals/sign-up-modal";
import { RestorePasswordModal } from "@/containers/header/components/modals/restore-password-modal";
import { RestorePasswordForm } from "@/containers/header/components/form/restore-password-form";
import {
    ConfirmEmailForm
    // action as confirmEmailAction
} from "@/containers/header/components/form/confirm-email-form";
import {
    ResetPasswordForm
    // action as resetPasswordAction
} from "@/containers/header/components/form/reset-password-form";
import { SecurityForm } from "@/components/forms/security-form";
import { SecurityBindEmailForm } from "@/components/forms/security-bind-email-form";
import { SecurityConfirmBindingEmailForm } from "@/components/forms/security-confirm-binding-email-form";
import { SecurityResetPasswordForm } from "@/components/forms/security-reset-password-form";
import { SecurityConfirmResetPasswordForm } from "@/components/forms/security-confirm-reset-password-form";
import { SecurityConfirmExistingEmailForm } from "@/components/forms/security-confirm-existing-email-form";

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
                path: "main",
                element: <MainPage />,
                children: [
                    {
                        path: "sign-in",
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
                                element: <RestorePasswordForm />
                            },
                            {
                                path: "confirm-email",
                                element: <ConfirmEmailForm />
                                // action: confirmEmailAction
                            },
                            {
                                path: "reset",
                                element: <ResetPasswordForm />
                                // action: resetPasswordAction
                            },
                            {
                                path: "*",
                                element: (
                                    <Navigate
                                        to="/aviator_front/main"
                                        replace
                                    />
                                )
                            }
                        ]
                    },
                    {
                        path: "security",
                        element: <PrivateRoute to="/aviator_front/main" />,
                        children: [
                            {
                                index: true,
                                element: <SecurityForm />
                            },
                            {
                                path: "bind-email",
                                element: <SecurityBindEmailForm />
                            },
                            {
                                path: "bind-email/confirm",
                                element: <SecurityConfirmBindingEmailForm />
                            },
                            {
                                path: "email/confirm",
                                element: <SecurityConfirmExistingEmailForm />
                            },
                            {
                                path: "reset-password",
                                element: <SecurityResetPasswordForm />
                            },
                            {
                                path: "reset-password/confirm",
                                element: <SecurityConfirmResetPasswordForm />
                            },
                            {
                                path: "*",
                                element: (
                                    <Navigate
                                        to="/aviator_front/main"
                                        replace
                                    />
                                )
                            }
                        ]
                    }
                ]
            },
            {
                path: "payment",
                element: <PrivateRoute to="/aviator_front/main" />,
                children: [
                    {
                        path: "draw",
                        element: <PaymentDrawPage />
                    },
                    {
                        path: "replenishment",
                        element: <PaymentReplenishmentPage />
                    },
                    {
                        path: "*",
                        element: (
                            <Navigate
                                to="/aviator_front/payment/draw"
                                replace
                            />
                        )
                    }
                ]
            },
            {
                path: "*",
                element: (
                    <Navigate
                        to="/aviator_front/main"
                        replace
                    />
                )
            }
        ]
    }
]);

export const ReactRouterProvider = () => {
    return <Provider router={router} />;
};
