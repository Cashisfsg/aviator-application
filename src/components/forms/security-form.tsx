import { Link } from "react-router-dom";

import { useGetUserQuery } from "@/store";

export const SecurityForm = () => {
    const { data: user } = useGetUserQuery();

    return (
        <div className="grid gap-y-4">
            <h3 className="text-center">Безопасность</h3>
            {user?.email ? (
                <>
                    <div className="grid gap-y-2">
                        <p>Ваш Email</p>
                        <p className="rounded-md border border-[#414148] px-4 py-2">
                            {user?.email}
                        </p>
                    </div>
                    <Link
                        to="/main/security/email/confirm"
                        state={{
                            nextUrl: "/main/security/bind-email"
                        }}
                        className=" text-right text-xs text-[#757b85]"
                    >
                        Изменить
                    </Link>
                </>
            ) : (
                <Link
                    to="/main/security/bind-email"
                    className="mt-2 rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
                >
                    Привязать Email
                </Link>
            )}
            <Link
                to="/main/security/reset-password"
                className="mt-2 rounded-md border border-gray-50 bg-[#2c2d30] px-4 py-2 text-center"
            >
                Изменить пароль
            </Link>
        </div>
    );
};
