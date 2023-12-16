import { cn } from "@/utils";
import React from "react";

type TableProps<
    H extends string[] | number[] | object,
    D extends (string[] | number[] | object)[]
> = {
    caption?: React.ReactElement;
    headers: H;
    data: D;
    renderHeader: (headers: H) => React.ReactElement;
    renderData: (data: D) => React.ReactElement;
};

export const Table = <
    H extends string[] | number[] | object,
    D extends (string[] | number[] | object)[]
>({
    caption,
    headers,
    data,
    renderHeader,
    renderData,
    className,
    ...props
}: TableProps<H, D> & React.TableHTMLAttributes<HTMLTableElement>) => {
    return (
        <table
            {...props}
            className={cn(
                "w-full border-separate border-spacing-x-0 border-spacing-y-1 leading-none",
                className
            )}
        >
            {caption ? <caption>{caption}</caption> : null}
            <thead>{renderHeader(headers)}</thead>
            <tbody className="text-sm">{renderData(data)}</tbody>
        </table>
    );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Row: React.FC<RowProps> = ({ className, children, ...props }) => {
    return (
        <tr
            {...props}
            className={cn(
                "[&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg",
                className
            )}
        >
            {children}
        </tr>
    );
};

interface TableHeaderCellProps
    extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <th
            {...props}
            className={cn("py-1 text-xs text-[#7b7b7b]", className)}
        >
            {children}
        </th>
    );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Cell: React.FC<TableCellProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <td
            {...props}
            className={cn("bg-[#101112] p-1 text-[#bbbfc5]", className)}
        >
            {children}
        </td>
    );
};
