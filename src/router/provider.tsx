import { lazy, Suspense } from "react";

import {
    createBrowserRouter,
    RouterProvider as Provider,
    Navigate
} from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

import { MainPage, ErrorPage } from "@/pages";
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

// const MainPage = lazy(async () =>
//     import("@/pages/main-page").then(module => ({ default: module.MainPage }))
// );

const PaymentLayout = lazy(async () =>
    import("@/pages/payment/layout").then(module => ({
        default: module.Layout
    }))
);

// const SignInModal = lazy(async () =>
//     import("@/containers/header/components/modals/sign-in-modal").then(
//         module => ({
//             default: module.SignInModal
//         })
//     )
// );

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
        element: (
            // <Suspense
            //     fallback={
            //         <GridLoader
            //             className="fixed left-1/2 top-1/2"
            //             color={"red"}
            //         />
            //     }
            // >
            <MainPage />
            // </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "sign-in",
                element: <SignInModal />,
                errorElement: <ErrorPage />
            },
            {
                path: "sign-up",
                element: <SignUpModal />,
                errorElement: <ErrorPage />
            },
            {
                path: "password",
                element: <RestorePasswordModal />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "restore",
                        element: <RestorePasswordForm />,
                        errorElement: <ErrorPage />
                    },
                    {
                        path: "confirm-email",
                        element: <ConfirmEmailForm />,
                        errorElement: <ErrorPage />

                        // action: confirmEmailAction
                    },
                    {
                        path: "reset",
                        element: <ResetPasswordForm />,
                        errorElement: <ErrorPage />

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
                errorElement: <ErrorPage />,
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
        element: (
            <PrivateRoute
                asChild
                to="/main"
            >
                <Suspense
                    fallback={
                        <GridLoader
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            color={"red"}
                        />
                    }
                >
                    <PaymentLayout />
                </Suspense>
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,

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
                    <Suspense
                        fallback={
                            <GridLoader
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                color={"red"}
                            />
                        }
                    >
                        <PaymentDrawPage />
                    </Suspense>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "replenishment",
                element: (
                    <Suspense
                        fallback={
                            <GridLoader
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                color={"red"}
                            />
                        }
                    >
                        <PaymentReplenishmentPage />
                    </Suspense>
                ),
                errorElement: <ErrorPage />
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
