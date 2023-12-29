import { Payment } from "../payment-draw-page";

interface PaymentProps extends React.HTMLAttributes<HTMLLIElement> {
    payment: Payment;
}

export const PaymentMethod: React.FC<PaymentProps> = ({
    payment,
    ...props
}) => {
    return (
        <li
            {...props}
            className="grid aspect-video w-full cursor-pointer select-none grid-rows-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] items-center gap-y-1 rounded-2.5xl bg-slate-300/70 px-3 py-2 leading-none shadow-md transition-transform duration-200 hover:scale-105"
        >
            <p className="text-right">{payment.currency}</p>
            <img
                src={payment.img}
                alt={payment.title}
                // height="60"
                className="max-h-full object-cover object-center"
            />
            <p className="text-left text-xs font-bold xs:text-sm sm:text-base">
                {payment.title}
            </p>
        </li>
    );
};
