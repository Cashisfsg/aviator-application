import { toast as sonner } from "sonner";
import { PiWarningFill } from "react-icons/pi";

export const toast = {
    notify: (message: string) => {
        sonner(message, {
            position: "top-center",
            action: {
                label: "Скрыть",
                onClick: () => {}
            }
        });
    },
    error: (message: string) => {
        sonner.error(message, {
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
};
