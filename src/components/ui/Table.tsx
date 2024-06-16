import { BaseProps } from "../../utils/types/interface";
interface TableProps extends BaseProps {
  width?: number | string;
  height?: number | string;
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
      bg: "bg-white",
      text: "text-[#667085]",
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

const Table = ({
  children = "",
  width = "auto",
  height = "auto",
  className = "",
}: TableProps) => {
  return (
    <div
      className="overflow-y-auto"
      style={{
        width: `${typeof width == "number" ? `${width}px` : width}`,
        height: `${typeof height == "number" ? `${height}px` : height}`,
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
      className={`font-medium cursor-default [&>tr]:text-[16px] ${bgColor} ${textColor} ${
        sticky ? "sticky top-0" : ""
      } ${className}`}
    >
      {children}
    </thead>
  );
};

const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="p-2 bg-white [&>tr:hover]:bg-slate-100">{children}</tbody>
  );
};

const TableRow = ({ children, className = "", ...rest }: TableRowProps) => {
  return (
    <tr className={`${className} border-b-[1px] last:border-none`} {...rest}>
      {children}
    </tr>
  );
};

const TableCell = ({
  children,
  className = "",
  align = "left",
  colSpan = 1,
}: TableCellProps) => {
  return (
    <td
      className={`px-2 py-4 ${TableOption.tableCol.align[align]} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export { TableHead, TableBody, TableRow, TableCell };

export default Table;
