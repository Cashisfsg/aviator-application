interface ClipboardCopyProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy: string | null | undefined;
}

export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
    children,
    onClick,
    textToCopy,
    ...props
}) => {
    const copyToClipboard: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log("Text to copy: ", textToCopy);

        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch (error) {
            console.error(error);
        }
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
