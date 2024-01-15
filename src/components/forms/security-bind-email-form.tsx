import { Navigate } from "react-router-dom";
import {
    emailValidationSchema as formSchema,
    EmailValidationFormSchema as FormSchema
} from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { useSendEmailChangeCodeMutation } from "@/store";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityBindEmailForm = () => {
    const [sendChangeCode, { isLoading, isSuccess, isError, error }] =
        useSendEmailChangeCodeMutation();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({ email }) => {
        await sendChangeCode({ email });
    };

    if (isSuccess) {
        return <Navigate to="/main/security/bind-email/confirm" />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                <span>Email</span>
                <Input
                    placeholder="Введите email"
                    {...register("email")}
                    aria-invalid={errors?.email ? "true" : "false"}
                    className="border-[#414148]"
                />
                {errors?.email ? (
                    <ErrorMessage message={errors?.email?.message} />
                ) : null}
                {isError ? (
                    <ErrorMessage message={error?.data?.message} />
                ) : null}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Привязать"
                )}
            </button>
        </form>
    );
};
