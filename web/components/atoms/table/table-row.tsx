export interface TableRowProps {
  name: string;
  value: string;
}
export const TableRow: React.FC<TableRowProps> = ({ name, value }) => (
  <tr key={name} className="odd:bg-white even:bg-blue-50">
    <th
      scope="row"
      className="w-1/3 px-2 py-4 overflow-hidden text-ellipsis text-gray-secondary whitespace-nowrap text-left"
    >
      {name}
    </th>
    <td className="text-slate-600 px-2 py-4">{value}</td>
  </tr>
);
