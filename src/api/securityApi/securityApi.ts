import { userApi } from "@/store/api/userApi";

export const securityApi = userApi.injectEndpoints({
    endpoints: builder => ({
        turnOn2FA: builder.mutation<void, void>({
            query: () => ({
                url: "/two-fa/set/on",
                method: "POST"
            })
        }),
        turnOff2FA: builder.mutation<void, void>({
            query: () => ({
                url: "/two-fa/set/off",
                method: "POST"
            })
        }),
        send2FAConfirmationCode: builder.mutation<void, { code: number }>({
            query: ({ code }) => ({
                url: "/two-fa/set",
                method: "POST",
                body: { code }
            })
        })
    })
});

export const {
    useTurnOn2FAMutation,
    useTurnOff2FAMutation,
    useSend2FAConfirmationCodeMutation
} = securityApi;
