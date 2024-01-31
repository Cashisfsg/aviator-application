// import { useState, useMemo, useCallback } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    // getPaginationRowModel,
    useReactTable,
    flexRender,
    getPaginationRowModel
} from "@tanstack/react-table";
import {
    useStateSelector,
    // useAppDispatch,
    selectAllFilters,
    Replenishment
} from "@/store";

import { StatusBar } from "./components/status-bar";
import { TableRowsPerPageSelector } from "./components/table-rows-per-page-selector";
import { Paginator } from "./components/paginator";
import { PageNavigation } from "./components/page-navigation";

import { formatDate, formatTime } from "@/utils/helpers";

import { IoSearchSharp } from "react-icons/io5";

const replenishments: Replenishment[] = [
    {
        _id: "1",
        user: "user1",
        amount: 100,
        currency: "USD",
        deduction: 10,
        status: "Ожидает оплаты",
        statusMessage: "Waiting for confirmation",
        isPayConfirmed: false,
        requisite: {
            _id: "r1",
            requisite: "123456789",
            name: "John Doe",
            currency: "USD",
            img: "img1.jpg",
            commission: 5,
            status: "active"
        },
        createdAt: "2022-01-01T12:00:00",
        completedDate: ""
    },
    {
        _id: "2",
        user: "user2",
        amount: 150,
        currency: "EUR",
        deduction: 15,
        status: "Отменена",
        statusMessage: "Payment completed successfully",
        isPayConfirmed: true,
        requisite: {
            _id: "r2",
            requisite: "987654321",
            name: "Jane Doe",
            currency: "EUR",
            img: "img2.jpg",
            commission: 8,
            status: "active"
        },
        createdAt: "2022-01-02T14:30:00",
        completedDate: "2022-01-02T15:00:00"
    }
];

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
        id: "debit",
        header: "Сумма списания",
        accessorFn: (row: Replenishment) => `${row.deduction} ${row.currency}`
    },
    {
        id: "status",
        header: "Статус",
        accessorKey: "status"
    },

    {
        id: "requisite",
        header: "Реквизиты",
        accessorFn: (row: Replenishment) =>
            `*${row.requisite.requisite.slice(-4)}`
    },
    {
        id: "date",
        header: "Дата",
        cell: cell => {
            return (
                <>
                    <div>{`Создано: ${formatDate(
                        cell.row.original.createdAt
                    )}`}</div>
                    <div>{`Завершено: ${formatDate(
                        cell.row.original.completedDate
                    )}`}</div>
                </>
            );
        }
    },
    {
        id: "actions",
        header: "Действия",
        cell: cell => {
            console.log(cell.row.original);

            return <button>Нажми меня</button>;
        }
    }
];

export const AdminReplenishmentPage = () => {
    return (
        <article className="bg-slate-200 py-8 text-black">
            <header className="flex items-center justify-between leading-none">
                <h1 className="text-2xl leading-none">
                    Выберите заявку на пополнение
                </h1>
                <span>
                    Добро пожаловать, User123
                    <a className="ml-3 cursor-pointer text-blue-500">Выйти</a>
                </span>
            </header>
            <section className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto]">
                <header>
                    <IoSearchSharp />
                    <input type="text" />
                </header>
                <ReplenishmentsTable
                    data={replenishments}
                    columns={columns}
                />
                <StatusBar />
            </section>
        </article>
    );
};

interface TableProps {
    data: Replenishment[];
    columns: typeof columns;
}

const ReplenishmentsTable: React.FC<TableProps> = ({ data, columns }) => {
    const filters = useStateSelector(state => selectAllFilters(state));
    // const dispatch = useAppDispatch();

    // const onColumnFiltersChange = useCallback([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: filters
        },
        enableFilters: true,
        enableColumnFilters: true
        // onColumnFiltersChange: params =>
        //     dispatch(filterByStatus( params ))
    });

    return (
        <>
            <table>
                <thead className="min-w-full border-b-4 border-double border-b-gray-400 bg-gray-300 text-xl font-medium uppercase text-gray-700">
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

                <tbody className="[&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:bg-gray-100">
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="border-b border-b-gray-400"
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className="px-3 py-2 "
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="col-span-2 flex w-full items-center justify-between py-5">
                <TableRowsPerPageSelector
                    onChange={event => {
                        table.setPageSize(Number(event.value));
                    }}
                />

                <Paginator
                    hasPreviousPage={!table.getCanPreviousPage()}
                    hasNextPage={!table.getCanNextPage()}
                    goToTheFirstPage={() => table.setPageIndex(0)}
                    goToThePreviousPage={() => table.previousPage()}
                    goToTheNextPage={() => table.nextPage()}
                    goToTheLastPage={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                    }
                />

                <PageNavigation
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    goToPage={table.setPageIndex}
                />
            </div>
        </>
    );
};
