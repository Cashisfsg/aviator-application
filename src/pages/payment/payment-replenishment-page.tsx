import { useState } from "react";

import { Popover } from "@/components/ui/popover/popover";
import { PaymentDepositDialog } from "@/components/dialogs";
import { DepositsHistoryPopover } from "@/components/popovers";
import {
    useGetUserQuery,
    useGetUserRequisitesQuery,
    useGetUserRecommendedRequisitesQuery
} from "@/store";

import { Header, PaymentMethod, TechnicalSupport } from "./components";

export const PaymentReplenishmentPage = () => {
    const [renderElement, setRenderElement] = useState<HTMLDivElement | null>(
        null
    );
    const [paymentDepositDialogOpen, setPaymentDepositDialogOpen] =
        useState(false);

    const { data: user } = useGetUserQuery();
    const { data: requisites, isSuccess: isRequisitesRequestSuccess } =
        useGetUserRequisitesQuery();
    const {
        data: recommendedRequisites,
        isSuccess: isRecommendedRequisitesRequestSuccess
    } = useGetUserRecommendedRequisitesQuery();

    return (
        <>
            <Header />
            <h1 className="text-2xl font-bold">Пополнение</h1>
            <article className="mt-6 flex-auto space-y-3 rounded-2.5xl bg-white px-2 pb-8 pt-4 text-black xs:px-4">
                <header className="grid grid-cols-2 grid-rows-2 items-start">
                    <p className="justify-self-start leading-5">Все методы</p>
                    <p className="justify-self-start text-sm leading-5 text-slate-400">
                        {user?.telegramId}
                    </p>
                    <div
                        ref={setRenderElement}
                        className="relative col-start-2 col-end-3 row-start-1 row-end-3 inline-block justify-self-end"
                    >
                        <Popover>
                            <Popover.Trigger className="bg-slate-300/70 px-3 py-1.5 leading-none transition-colors duration-300 hover:bg-slate-300/60">
                                История
                            </Popover.Trigger>
                            <Popover.Portal renderElement={renderElement}>
                                <Popover.Content className="bg-transparent">
                                    <DepositsHistoryPopover />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover>
                        {/* <button
                            id="trigger"
                            onClick={() => {
                                dialogRef.current?.close();
                            }}
                        >
                            История
                        </button>
                        <dialog
                            ref={dialogRef}
                            onClick={event => {
                                const rect =
                                    dialogRef.current?.getBoundingClientRect();
                                const isInDialog =
                                    rect.top <= event.clientY &&
                                    event.clientY <= rect.bottom &&
                                    rect.left <= event.clientX &&
                                    event.clientX <= rect.left + rect.width;
                                if (!isInDialog) {
                                    dialogRef.current?.close();
                                }
                            }}
                            className="absolute left-auto top-[calc(100%+0.25rem)] m-0 border border-red-400"
                        >
                            Popover
                        </dialog> */}
                    </div>
                </header>
                <section>
                    <h2 className="text-lg uppercase text-slate-400">
                        Рекомендуемые способы
                    </h2>
                    {isRecommendedRequisitesRequestSuccess ? (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {recommendedRequisites.map(requisite => (
                                <PaymentMethod
                                    key={requisite._id}
                                    requisite={requisite}
                                    onClick={() => {
                                        setPaymentDepositDialogOpen(true);
                                    }}
                                />
                            ))}
                        </ul>
                    ) : null}
                </section>

                {isRequisitesRequestSuccess
                    ? requisites.map(requisite => (
                          <section key={requisite.currency}>
                              <h2 className="text-lg uppercase text-slate-400">
                                  Методы {requisite.currency}
                              </h2>
                              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {requisite.requisites.map(method => (
                                      <PaymentMethod
                                          key={method._id}
                                          requisite={method}
                                          onClick={() => {
                                              setPaymentDepositDialogOpen(true);
                                          }}
                                      />
                                  ))}
                              </ul>
                          </section>
                      ))
                    : null}

                <TechnicalSupport />

                <PaymentDepositDialog
                    open={paymentDepositDialogOpen}
                    setOpen={setPaymentDepositDialogOpen}
                />
            </article>
        </>
    );
};
