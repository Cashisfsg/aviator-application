interface TableProps {
    caption?: string;
    data: object[];
    headers: string[];
}

export const Table: React.FC<TableProps> = ({ data, headers }) => {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
        </table>
    );
};

const Row = () => {
    return <></>;
};

const Cell = () => {
    return <></>;
};
