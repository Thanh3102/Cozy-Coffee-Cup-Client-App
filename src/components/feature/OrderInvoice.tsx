import { currencyFormatter } from "../../utils/currencyFormat";
import { ItemOption, OrderDetailItem } from "../../utils/types/type";

interface Props {
  orderItems: OrderDetailItem[];
}

const OrderInvoice = ({ orderItems }: Props) => {
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

  const calcOrderTotalMoney = (items: OrderDetailItem[]) => {
    let total = 0;
    for (let item of items) {
      if (item.is_gift) continue;
      total += calcProductTotalMoney(item);
    }
    return total;
  };
  return (
    <div className="my-2 text-[14px]">
      <div className="flex">
        <span className="flex-1">Sản phẩm:</span>
        <span className="flex-1 text-right">
          {currencyFormatter.format(calcOrderTotalMoney(orderItems))}
        </span>
      </div>
      <div className="flex">
        <span className="flex-1">Thuế:</span>
        <span className="flex-1 text-right">{currencyFormatter.format(0)}</span>
      </div>
      <div className="flex">
        <span className="flex-1">Chi phí khác:</span>
        <span className="flex-1 text-right">{currencyFormatter.format(0)}</span>
      </div>
      <div className="w-full h-[1px] bg-black my-2"></div>
      <div className="flex font-semibold text-[16px]">
        <span className="flex-1">Tổng tiền:</span>
        <span className="flex-1 text-right">
          {currencyFormatter.format(calcOrderTotalMoney(orderItems))}
        </span>
      </div>
    </div>
  );
};

export default OrderInvoice;
