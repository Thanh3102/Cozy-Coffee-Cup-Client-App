import { Fragment } from "react/jsx-runtime";
import { ItemOption, OrderDetailItem } from "../../../utils/types/type";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { currencyFormatter } from "../../../utils/currencyFormat";

interface Props {
  orderItems: OrderDetailItem[];
}

const OrderItemPaymentTable = ({ orderItems }: Props) => {
  const calcProductOptionMoney = (options: ItemOption[]) => {
    let total = 0;
    for (let option of options) {
      option.order_item_option_values.map((value) => (total += value.price));
    }
    return total;
  };

  const calcProductTotalMoney = (item: OrderDetailItem) => {
    let total = 0;
    let optionPrice = calcProductOptionMoney(item.order_item_options);
    total = (item.price + optionPrice) * item.quantity;
    return total;
  };

  const optionToString = (orderItem: OrderDetailItem) => {
    let string = "";
    for (let opt of orderItem.order_item_options) {
      let value = "";
      opt.order_item_option_values.map((v, i) => {
        if (i !== 0) value += ",";
        value += v.name;
      });
      string += ` ${opt.title}: ${value},`;
    }
    return string;
  };

  return (
    <Fragment>
      <div className="flex-[7]">
        <Table height={400}>
          <TableHead sticky>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tổng tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((orderItem, index) => {
              return (
                <TableRow key={orderItem.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-[13px] relative font-medium">
                    {`${orderItem.product.name} (${optionToString(orderItem)})`}
                    <span
                      className={`absolute left-0 top-2 text-[10px] text-red-400 ${
                        orderItem.is_gift ? "" : "hidden"
                      }`}
                    >
                      Tặng kèm
                    </span>
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(
                      orderItem.price +
                        calcProductOptionMoney(orderItem.order_item_options)
                    )}
                  </TableCell>
                  <TableCell align="center">{orderItem.quantity}</TableCell>
                  <TableCell>
                    {currencyFormatter.format(calcProductTotalMoney(orderItem))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

    </Fragment>
  );
};

export default OrderItemPaymentTable;
