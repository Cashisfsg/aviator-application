import { useGetSupportServiceLinkQuery } from "@/store";

import { FaPhoneVolume } from "react-icons/fa6";

export const TechnicalSupport = () => {
    const { data } = useGetSupportServiceLinkQuery();

    return (
        <a
            href={data?.link}
            target="_blank"
            className="fixed right-5 top-[80%] flex items-center gap-x-2 rounded-lg border bg-slate-100/90 px-3 py-2 shadow-md transition-transform duration-200 lg:bg-slate-300 mh:hover:scale-110"
        >
            <FaPhoneVolume />
            <span className="sr-only sm:not-sr-only">Поддержка 24/7</span>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
        </a>
    );
};
