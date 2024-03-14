import { selectInitData, useStateSelector } from "@/store";
import { useGetUserQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";

import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { UploadImage } from "./upload-image";

import Avatar from "@/assets/avatar-360w.webp";

export const UserProfileDetails = () => {
    const { isAuthenticated } = useAuth();

    const { data: user, isLoading } = useGetUserQuery(undefined, {
        skip: !isAuthenticated
    });
    const userInitData = useStateSelector(state => selectInitData(state));

    return (
        <div className="flex items-center justify-between gap-1.5 p-2.5">
            <div className="grid w-max grid-cols-[auto_auto] grid-rows-2 items-center gap-x-2.5 leading-none">
                {isLoading ? (
                    <>
                        <span className="row-span-2 size-10 animate-pulse rounded-full bg-slate-500" />

                        <span className="h-3 w-[13ch] animate-pulse rounded-full bg-slate-500" />

                        <span className="h-3 w-[13ch] animate-pulse rounded-full bg-slate-500" />
                    </>
                ) : (
                    <>
                        <img
                            src={
                                user?.profileImage ||
                                userInitData?.profileImage ||
                                Avatar
                            }
                            alt="Аватар профиля"
                            width="40"
                            height="40"
                            onError={event => {
                                event.currentTarget.src = Avatar;
                            }}
                            className="row-span-2 rounded-full"
                        />

                        <p className="max-w-[11ch] overflow-hidden text-ellipsis whitespace-nowrap">
                            {user?.login || userInitData?.login || "Username"}
                        </p>

                        <ClipboardCopy
                            textToCopy={user?.uid}
                            className="max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap text-left text-xs"
                        >
                            {user?.uid ? `ID ${user?.uid}` : "user ID"}
                        </ClipboardCopy>
                    </>
                )}
            </div>
            {isAuthenticated ? <UploadImage /> : null}
        </div>
    );
};
