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
  rowSpan?: number;
}

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
  bgColor,
  textColor,
  sticky,
}: TableHeadProps) => {
  return (
    <thead
      className={`font-medium cursor-default [&>tr]:text-base ${textColor} ${
        sticky ? "sticky top-0 z-10" : ""
      } ${className}`}
      style={{
        backgroundColor: bgColor ?? "#FFF",
        color: bgColor ? "#FFF" : "#667085",
      }}
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
    <tr
      className={`${className} border-b-[1px] text-sm md:text-base last:border-none`}
      {...rest}
    >
      {children}
    </tr>
  );
};

const TableCell = ({
  children,
  className = "",
  align = "left",
  colSpan = 1,
  rowSpan = 1,
}: TableCellProps) => {
  return (
    <td
      align={align}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`px-2 py-4 ${TableOption.tableCol.align[align]} ${className}`}
      // colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export { TableHead, TableBody, TableRow, TableCell };

export default Table;
