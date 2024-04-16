import { useGetServiceLinkQuery } from "@/store";

import { FaPhoneVolume } from "react-icons/fa6";

export const TechnicalSupport = () => {
    const { data: links } = useGetServiceLinkQuery();

    return (
        <a
            href={links?.support}
            target="_blank"
            className="absolute right-5 top-[80%] flex items-center gap-x-2 rounded-lg border bg-slate-100/90 px-3 py-2 shadow-md transition-transform duration-200 mh:hover:scale-110"
        >
            <FaPhoneVolume />
            <span className="sr-only sm:not-sr-only">Поддержка 24/7</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#36ca12]"></span>
        </a>
    );
};
