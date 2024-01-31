import { useAppDispatch, filterByStatus } from "@/store";

export const StatusBar = () => {
    const dispatch = useAppDispatch();

    return (
        <aside className="col-start-2 col-end-3 row-start-1 row-end-3">
            Статусы
            <ul>
                <li
                    className="cursor-pointer"
                    onClick={() => dispatch(filterByStatus(""))}
                >
                    Все
                </li>
                <li
                    className="cursor-pointer"
                    onClick={() => dispatch(filterByStatus("Ожидает оплаты"))}
                >
                    Активная
                </li>
                <li
                    className="cursor-pointer"
                    onClick={() =>
                        dispatch(filterByStatus("Успешно завершена"))
                    }
                >
                    Успешно завершенные
                </li>
                <li
                    className="cursor-pointer"
                    onClick={() => dispatch(filterByStatus("Отменена"))}
                >
                    Отменённые
                </li>
            </ul>
        </aside>
    );
};
