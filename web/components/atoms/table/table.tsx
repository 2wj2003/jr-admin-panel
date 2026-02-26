import { TableRow, TableRowProps } from './table-row';

interface TableProps {
  rows: TableRowProps[];
}

export const Table: React.FC<TableProps> = ({ rows }) => {
  return (
    <table className="w-full">
      <tbody>
        {rows?.map((row) => (
          <TableRow key={row.name} name={row.name} value={row.value} />
        ))}
      </tbody>
    </table>
  );
};
