import { useState } from "react";

import { Popover } from "@/components/ui/popover/popover";
import { PaymentDepositDialog } from "@/components/dialogs";
import { DepositsHistoryPopover } from "@/components/popovers";
import {
    useGetUserQuery,
    useGetUserRequisitesQuery,
    useGetUserRecommendedRequisitesQuery
} from "@/store";

import { PaymentMethod, TechnicalSupport } from "./components";

export const PaymentReplenishmentPage = () => {
    const [renderElement, setRenderElement] = useState<HTMLDivElement | null>(
        null
    );
    const [paymentDepositDialogOpen, setPaymentDepositDialogOpen] =
        useState(false);
    const [initialFormState, setInitialFormState] = useState({
        state: "init",
        replenishmentId: ""
    });
    const [selectedRequisiteId, setSelectedRequisiteId] = useState("");

    const { data: user } = useGetUserQuery();
    const { data: requisites, isSuccess: isRequisitesRequestSuccess } =
        useGetUserRequisitesQuery();
    const {
        data: recommendedRequisites,
        isSuccess: isRecommendedRequisitesRequestSuccess
    } = useGetUserRecommendedRequisitesQuery();

    return (
        <>
            <h1 className="text-2xl font-bold">Пополнение</h1>
            <article className="mt-6 flex-auto space-y-3 rounded-2.5xl bg-white px-2 pb-8 pt-4 text-black xs:px-4">
                <header className="grid grid-cols-2 grid-rows-2 items-start">
                    <p className="justify-self-start leading-5">Все методы</p>
                    <p className="inline-block max-w-32 justify-self-start overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 text-slate-400">
                        {`ID ${user?._id}`}
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
                                    <DepositsHistoryPopover
                                        setInitialFormState={
                                            setInitialFormState
                                        }
                                        setDialogOpen={
                                            setPaymentDepositDialogOpen
                                        }
                                    />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover>
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
                                        setInitialFormState(state => ({
                                            ...state,
                                            state: "init"
                                        }));
                                        setSelectedRequisiteId(requisite._id);
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
                                              setInitialFormState(state => ({
                                                  ...state,
                                                  state: "init"
                                              }));
                                              setSelectedRequisiteId(
                                                  method._id
                                              );
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
                    initialFormState={initialFormState}
                    setOpen={setPaymentDepositDialogOpen}
                    selectedRequisiteId={selectedRequisiteId}
                />
            </article>
        </>
    );
};
