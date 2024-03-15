// import { useState, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChangeEmailMutation } from "@/store/api/userApi";

import { toast } from "@/components/toasts/toast";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";
import { handleErrorResponse } from "@/store/services";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmBindingEmailForm = () => {
    // const [errorState, setErrorState] = useState({
    //     message: "",
    //     isError: false
    // });
    const navigate = useNavigate();
    const location = useLocation();

    // const codeId = useId();
    // const codeErrorId = useId();

    const [changeEmail, { isLoading }] = useChangeEmailMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;
            await changeEmail({
                code: Number(code.value)
            }).unwrap();
            toast.notify("Email был успешно изменён");
            navigate("/main/security");
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    // const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    //     setErrorState(state => ({ ...state, isError: false, message: "" }));
    // };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    readOnly
                    value={location?.state?.email}
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>
            <Label>
                <span>Введите код</span>
                <Input
                    // id={codeId}
                    placeholder="Введите код"
                    name="code"
                    // aria-invalid={errorState.isError}
                    // aria-errormessage={
                    //     errorState.isError ? codeErrorId : undefined
                    // }
                    // onFocus={onFocusHandler}
                    className="border-[#414148]"
                />
                {/* {errorState.isError ? (
                    <ErrorMessage
                        id={codeErrorId}
                        htmlFor={codeId}
                        message={errorState.message}
                    />
                ) : null} */}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Сохранить"
                )}
            </button>
        </form>
    );
};
