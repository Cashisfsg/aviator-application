import { toast } from "sonner";

interface ClipboardCopyProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy: number | string | null | undefined;
    toastMessage?: string;
}

export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
    children,
    onClick,
    textToCopy,
    toastMessage = "ID скопирован в буфер обмена",
    ...props
}) => {
    const copyToClipboard: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(String(textToCopy));
        } catch (error) {
            console.error(error);
        }

        toast(toastMessage, {
            position: "top-center",
            action: {
                label: "Скрыть",
                onClick: () => {}
            }
        });
    };

    return (
        <button
            title="Скопировать в буфер обмена"
            onClick={onClick || copyToClipboard}
            {...props}
        >
            {children}
        </button>
    );
};
