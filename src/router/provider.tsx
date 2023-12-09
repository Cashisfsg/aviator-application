import {
    createBrowserRouter,
    RouterProvider as Provider
} from "react-router-dom";
import { SignInModal } from "@/containers/header/components/modals/sign-in-modal";
import { SignUpModal } from "@/containers/header/components/modals/sign-up-modal";

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
            }
        ]
    }
]);

export const ReactRouterProvider = () => {
    return <Provider router={router} />;
};
