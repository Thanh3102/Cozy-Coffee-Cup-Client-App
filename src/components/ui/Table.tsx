import { BaseProps } from "../../utils/types/interface";
interface TableProps extends BaseProps {
  width?: number;
  height?: number;
}
interface TableHeadProps extends BaseProps {
  bgColor?: string | null;
  textColor?: string | null;
  sticky?: boolean;
}
interface TableBodyProps extends BaseProps {
  bgColor?: string | null;
}
interface TableRowProps extends BaseProps {}
interface TableCellProps extends BaseProps {
  align?: "left" | "center" | "right";
  colSpan?: number;
}

const tableDefault = {
  TableHead: {
    color: {
      bg: "bg-amber-600",
      text: "text-white",
    },
  },
  TableBody: {},
};

const TableOption = {
  tableCol: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
};

const Table = ({ children = "", width, height, className }: TableProps) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflowY: "auto",
      }}
    >
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

const TableHead = ({
  children,
  className = "",
  bgColor = tableDefault.TableHead.color.bg,
  textColor = tableDefault.TableHead.color.text,
  sticky,
}: TableHeadProps) => {
  return (
    <thead
      className={`${bgColor} ${textColor} ${
        sticky ? "sticky top-0" : ""
      } text-[18px] font-medium cursor-default ${className}`}
    >
      {children}
    </thead>
  );
};

const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="p-2 bg-white [&>*:hover]:bg-slate-100">{children}</tbody>
  );
};

const TableRow = ({ children, className = "" }: TableRowProps) => {
  return (
    <tr className={`${className} border-b-[1px] last:border-none`}>
      {children}
    </tr>
  );
};

const TableCell = ({
  children,
  align = "left",
  colSpan = 1,
}: TableCellProps) => {
  return (
    <td
      className={`p-2 ${TableOption.tableCol.align[align]} text-[16px] py-4`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export { TableHead, TableBody, TableRow, TableCell };

export default Table;
