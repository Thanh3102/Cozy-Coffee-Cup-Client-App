import { useEffect, useState } from "react";
import { currencyFormatter } from "../../../utils/currencyFormat";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import axiosClient from "../../../lib/axios";

type SaleProduct = {
  id: number;
  name: string;
  sales: number;
  revenue: number;
};

const TopSaleProductTable = () => {
  const [saleProducts, setSaleProduct] = useState<SaleProduct[]>([]);

  const fetchSaleProducts = async () => {
    try {
      const { products } = await axiosClient.get<
        void,
        { products: SaleProduct[] }
      >("/api/statistic/getTopSaleProduct");
      setSaleProduct(products);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  return (
    <Table>
      <TableHead sticky>
        <TableRow>
          <TableCell>Mã sản phẩm</TableCell>
          <TableCell>Tên sản phẩm</TableCell>
          <TableCell>Doanh số</TableCell>
          <TableCell>Doanh thu</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {saleProducts.map((product, index) => (
          <TableRow>
            <TableCell>{product.id}</TableCell>
            <TableCell className="text-sm">{product.name}</TableCell>
            <TableCell>{product.sales}</TableCell>
            <TableCell>{currencyFormatter.format(product.revenue)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopSaleProductTable;
