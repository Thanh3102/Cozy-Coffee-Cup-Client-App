import { currencyFormatter } from "../../../utils/currencyFormat";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";

const TopSaleProductTable = () => {
  return (
    <Table>
      <TableHead sticky>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Mã sản phẩm</TableCell>
          <TableCell>Tên sản phẩm</TableCell>
          <TableCell>Doanh số</TableCell>
          <TableCell>Doanh thu</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>1</TableCell>
          <TableCell>Trà Xanh Espresso Marble</TableCell>
          <TableCell>99999</TableCell>
          <TableCell>{currencyFormatter.format(999999999)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TopSaleProductTable;
