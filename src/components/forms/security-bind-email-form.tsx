import { Navigate } from "react-router-dom";
import {
    emailValidationSchema,
    EmailValidationFormSchema
} from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { useSendEmailChangeCodeMutation } from "@/store";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SecurityBindEmailForm = () => {
    const [sendChangeCode, { isSuccess }] = useSendEmailChangeCodeMutation();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<EmailValidationFormSchema>({
        resolver: zodResolver(emailValidationSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmitHandler: SubmitHandler<EmailValidationFormSchema> = async ({
        email
    }) => {
        await sendChangeCode({ email });
    };

    if (isSuccess) {
        return (
            <Navigate to="/aviator_front/main/security/bind-email/confirm" />
        );
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
            </Label>
            <button className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5">
                Привязать
            </button>
        </form>
    );
};
