import { lazy, Suspense } from "react";

import {
    createBrowserRouter,
    RouterProvider as Provider,
    Navigate
} from "react-router-dom";

import { MainPage } from "@/pages";
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
import {
    SecurityForm,
    SecurityBindEmailForm,
    SecurityConfirmBindingEmailForm,
    SecurityConfirmExistingEmailForm,
    SecurityConfirmResetPasswordForm,
    SecurityResetPasswordForm
} from "@/components/forms";

const PaymentDrawPage = lazy(async () =>
    import("@/pages/payment/payment-draw-page").then(module => ({
        default: module.PaymentDrawPage
    }))
);

const PaymentReplenishmentPage = lazy(async () =>
    import("@/pages/payment/payment-replenishment-page").then(module => ({
        default: module.PaymentReplenishmentPage
    }))
);

const router = createBrowserRouter([
    // {
    // path: "aviator_front",
    // async lazy() {
    //     return import("@/containers/layout").then(module => ({
    //         Component: module.Layout
    //     }));
    // },
    // children: [
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
                                to="/main"
                                replace
                            />
                        )
                    }
                ]
            },
            {
                path: "security",
                element: <PrivateRoute to="/main" />,
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
                                to="/main"
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
        element: <PrivateRoute to="/main" />,
        children: [
            {
                path: "draw",
                // async lazy() {
                //     return import("@/pages/payment/payment-draw-page").then(
                //         module => ({
                //             Component: module.PaymentDrawPage
                //         })
                //     );
                // }
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <PaymentDrawPage />
                    </Suspense>
                )
            },
            {
                path: "replenishment",
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <PaymentReplenishmentPage />
                    </Suspense>
                )
            },
            {
                path: "*",
                element: (
                    <Navigate
                        to="/payment/draw"
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
                to="/main"
                replace
            />
        )
    }
    //     ]
    // },
    // {
    //     path: "*",
    //     element: (
    //         <Navigate
    //             to="/main"
    //             replace
    //         />
    //     )
    // }
]);

export const ReactRouterProvider = () => {
    return <Provider router={router} />;
};
