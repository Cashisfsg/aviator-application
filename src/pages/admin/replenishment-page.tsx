// import { useMemo } from "react";
import {
    getCoreRowModel,
    // getFilteredRowModel,
    // getPaginationRowModel,
    useReactTable,
    flexRender
} from "@tanstack/react-table";
import type { Replenishment } from "@/store";

const columns = [
    {
        id: "id",
        header: "ID заявки",
        accessorKey: "_id"
    },
    {
        header: "Сумма",
        accessorKey: "amount"
    },
    {
        header: "Сумма списания",
        accessorKey: "deduction"
    },
    {
        header: "Статус",
        accessorKey: "status"
    },
    // {
    //     id: "sum",
    //     header: "Сумма списания",
    //     accessorFn: (row: Replenishment) => `${row.requisite.name}`
    // }
    {
        header: "Дата",
        accessorKey: "createdAt"
    },
    {
        header: "Действия",
        cell: () => <button>Нажми меня</button>
    }
];

export const ReplenishmentPage = () => {
    return (
        <section className="bg-slate-200 py-8 text-black">
            <header className="flex items-center justify-between leading-none">
                <h1 className="text-2xl leading-none">
                    Выберите заявку на пополнение
                </h1>
                <span>
                    Добро пожаловать, User123
                    <a className="ml-3 cursor-pointer text-blue-500">Выйти</a>
                </span>
            </header>
            <ReplenishmentsTable columns={columns} />
        </section>
    );
};

interface TableProps {
    data: Replenishment[];
    columns: typeof columns;
}

const ReplenishmentsTable: React.FC<TableProps> = ({ data, columns }) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <table>
            <thead className="min-w-full border-b-4 border-double border-b-gray-400 bg-gray-200 text-xl font-medium uppercase text-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr
                        key={headerGroup.id}
                        className="min-w-full text-base [&>*:nth-child(1)]:w-[72px] [&>*:nth-child(2)]:w-fit [&>*:nth-child(3)]:w-2/12 [&>*:nth-child(4)]:w-[250px] [&>*:nth-child(5)]:w-[150px] [&>*:nth-child(6)]:w-max [&>*:nth-child(7)]:w-[150px] [&>*:nth-child(8)]:w-max [&>*:nth-child(9)]:w-max"
                    >
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                // onClick={header.column.getToggleSortingHandler()}
                                className="px-3 py-2"
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
        </table>
    );
};
