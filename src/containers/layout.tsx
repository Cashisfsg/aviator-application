import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

export const Layout = () => {
    return (
        <>
            <main className="content-wrapper flex flex-auto flex-col">
                <Outlet />
            </main>
            <Toaster />
        </>
    );
};
