import { useRef } from "react";
import { toast } from "sonner";

import { useActivatePromoCodeMutation } from "@/store/api/userApi";
import { ImSpinner9 } from "react-icons/im";
import { PiWarningFill } from "react-icons/pi";
import { isErrorWithMessage, isFetchBaseQueryError } from "@/store/services";

interface FormFields {
    promoCode: HTMLInputElement;
}
export const ActivationBonusForm = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [activatePromo, { isLoading }] = useActivatePromoCodeMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { promoCode } = event.currentTarget;
            const promo = promoCode.value;

            await activatePromo({ promoCode: promo }).unwrap();

            promoCode.setAttribute("type", "button");
            buttonRef.current?.setAttribute("disabled", "");

            toast("Промокод успешно активирован", {
                position: "top-center",
                action: {
                    label: "Скрыть",
                    onClick: () => {}
                }
            });
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                const errorMessage =
                    "error" in error
                        ? error.error
                        : (
                              error.data as {
                                  status: number;
                                  message: string;
                              }
                          ).message;
                toast.error(errorMessage, {
                    position: "top-center",
                    action: {
                        label: "Скрыть",
                        onClick: () => {}
                    },
                    icon: (
                        <PiWarningFill className="text-4xl leading-none text-red-500" />
                    )
                });
            } else if (isErrorWithMessage(error)) {
                toast.error(error.message, {
                    position: "top-center",
                    action: {
                        label: "Скрыть",
                        onClick: () => {}
                    },
                    icon: (
                        <PiWarningFill className="text-4xl leading-none text-red-500" />
                    )
                });
            }
        }
    };

    const onClickHandler: React.MouseEventHandler<HTMLInputElement> = event => {
        event.currentTarget.type = "text";
        event.currentTarget.setAttribute("defaultValue", "");
        event.currentTarget.setAttribute("value", "");
        buttonRef.current?.removeAttribute("disabled");
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="group flex basis-32 flex-col gap-1"
        >
            <input
                type="button"
                name="promoCode"
                required
                autoComplete="off"
                defaultValue="Ввести промокод"
                onClick={onClickHandler}
                className="w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 focus-visible:outline-none group-has-[input[type=button]:active]:translate-y-[1px] group-has-[input[type=button]:active]:border-[#1c7430] group-has-[input[type=button]:hover]:bg-green-350"
            />
            <button
                type="submit"
                disabled={isLoading}
                ref={buttonRef}
                className="w-full rounded-full border-2 border-gray-50 bg-[#2c2d30] text-center text-[10px] text-white disabled:opacity-75 group-has-[input[type=button]]:pointer-events-none group-has-[input[type=button]]:hidden"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-[20px]" />
                ) : (
                    "Активировать"
                )}
            </button>
        </form>
    );
};
