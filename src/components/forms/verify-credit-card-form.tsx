import { useRef, useId } from "react";
import { useParams } from "react-router-dom";

import { toast } from "@/components/toasts/toast";

import UploadIcon from "@/assets/upload.png";
import { ImSpinner9 } from "react-icons/im";

export const VerifyCreditCardForm = () => {
    const inputFileId = useId();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { replenishmentId } = useParams();

    console.log(replenishmentId);

    const uploadImageHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = async event => {
        const input = event.currentTarget;

        if (!input.files) return;

        const file = input.files[0];

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Размер файла не должен превышать 3 мб");
            input.value = "";
            return;
        }

        buttonRef.current?.removeAttribute("disabled");
    };

    return (
        <form>
            <label
                htmlFor={inputFileId}
                className="mx-auto grid w-max cursor-pointer grid-cols-[auto_minmax(0,_1fr)] grid-rows-[repeat(3,_auto)] place-content-center gap-x-4"
            >
                <div className="row-span-3 flex w-full items-center justify-end">
                    <img
                        src={UploadIcon}
                        alt="Загрузить фото кредитной карты"
                        height="40"
                        width="60"
                        className=""
                    />
                </div>

                <strong className="row-span-3 flex items-center text-sm sm:row-auto md:text-lg xs:text-base">
                    Загрузить файл
                </strong>
                <span className="hidden text-xs sm:block">
                    Максимальный размер файла 3 МБ
                </span>
                <span className="hidden text-xs sm:block">
                    Доступные форматы: PNG, JPG, PDF
                </span>
            </label>

            <div className="mt-4 text-xs font-bold sm:hidden">
                <p>* Максимальный размер файла 3 МБ</p>
                <p>** Доступные форматы: PNG, JPG, PDF</p>
            </div>

            <input
                id={inputFileId}
                type="file"
                multiple={false}
                accept="image/*, .pdf"
                hidden
                onChange={uploadImageHandler}
            />

            <button
                disabled
                className="mx-auto mt-4 block w-full max-w-72 rounded-md bg-green-500 px-4 py-2 text-base font-semibold text-white shadow-md transition-colors duration-300 focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
                ref={buttonRef}
            >
                {false ? (
                    <ImSpinner9 className="mx-auto animate-spin text-2xl" />
                ) : (
                    "Пополнить"
                )}
            </button>
        </form>
    );
};
