import { lazy, Suspense } from "react";

import {
    createBrowserRouter,
    RouterProvider as Provider,
    Navigate
} from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

import { MainPage, ErrorPage } from "@/pages";
import { PrivateRoute } from "./private-outlet";

// import {
//     ConfirmEmailForm
//     // action as confirmEmailAction
// } from "@/containers/header/components/form/confirm-email-form";
// import {
//     ResetPasswordForm
//     // action as resetPasswordAction
// } from "@/containers/header/components/form/reset-password-form";
import {
    SecurityForm,
    SecurityBindEmailForm,
    SecurityConfirmBindingEmailForm,
    SecurityConfirmExistingEmailForm,
    SecurityConfirmResetPasswordForm,
    SecurityResetPasswordForm,
    SecurityTwoFAForm
} from "@/components/forms";

import { CreateReplenishmentDialog } from "@/components/dialogs/create-replenishment-dialog";
import { ReplenishmentDetailsDialog } from "@/components/dialogs/replenishment-details-dialog";

import { ReferralRedirect } from "./referral-redirect";
import { VerifyReplenishmentDialog } from "@/components/dialogs/verify-replenishment-dialog";

const PaymentLayout = lazy(async () =>
    import("@/pages/payment/layout").then(module => ({
        default: module.Layout
    }))
);

const SignInModal = lazy(async () =>
    import("@/containers/header/components/modals/sign-in-modal").then(
        module => ({
            default: module.SignInModal
        })
    )
);

const SignUpModal = lazy(async () =>
    import("@/containers/header/components/modals/sign-up-modal").then(
        module => ({
            default: module.SignUpModal
        })
    )
);

const RestorePasswordForm = lazy(async () =>
    import("@/containers/header/components/form/restore-password-form").then(
        module => ({
            default: module.RestorePasswordForm
        })
    )
);

const ConfirmEmailForm = lazy(async () =>
    import("@/containers/header/components/form/confirm-email-form").then(
        module => ({
            default: module.ConfirmEmailForm
        })
    )
);

const ResetPasswordForm = lazy(async () =>
    import("@/containers/header/components/form/reset-password-form").then(
        module => ({
            default: module.ResetPasswordForm
        })
    )
);

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
    {
        path: "main",
        element: <MainPage />,
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
                        path: "two-fa",
                        element: <SecurityTwoFAForm />
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
                children: [
                    {
                        path: "requisite/:requisiteId",
                        element: <CreateReplenishmentDialog />
                    },
                    {
                        path: "requisite/:requisiteId/replenishment/:replenishmentId",
                        element: <ReplenishmentDetailsDialog />
                    },
                    {
                        path: "verify/:replenishmentId",
                        element: <VerifyReplenishmentDialog />
                    }
                ],
                errorElement: <ErrorPage />
            },
            // {
            //     path: "replenishment/:replenishmentId",
            //     element: (
            //         <Suspense
            //             fallback={
            //                 <GridLoader
            //                     className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            //                     color={"red"}
            //                 />
            //             }
            //         >
            //             <div>Replenishment id</div>
            //         </Suspense>
            //     ),
            //     errorElement: <ErrorPage />
            // },
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
        path: "referral",
        element: <ReferralRedirect />
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
]);

export const ReactRouterProvider = () => {
    return <Provider router={router} />;
};
