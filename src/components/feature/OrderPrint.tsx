import { forwardRef } from "react";
import {
  ItemOption,
  OrderDetail,
  OrderDetailItem,
} from "../../utils/types/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/dateFormat";
import { currencyFormatter } from "../../utils/currencyFormat";
import OrderInvoice from "./OrderInvoice";

interface Props {
  order: OrderDetail;
  refer: React.RefObject<any>;
}

const OrderPrint = ({ order, refer }: Props) => {
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

  return (
    <div className="absolute left-0 right-0 top-0 bottom-0" ref={refer}>
      <div className="w-[500px] mx-auto my-0">
        <div className="flex flex-col items-center mt-20">
          <div className="flex gap-4 font-bold text-[40px] items-center">
            <FontAwesomeIcon icon={faMugHot} />
            <h1 className="">Cozy Coffee Cup</h1>
          </div>
          <p>Số XX, Đường ABC, Quận XYZ, Hà Nội</p>
        </div>
        <div className="flex justify-between my-5">
          <p>Thời gian: {formatDate(order.payment_at)}</p>
          <p>Mã hóa đơn: {order.id}</p>
        </div>
        <p>Thu ngân: {order.user.name}</p>
        <div className="w-full mt-2">
          <table width={"100%"}>
            <thead className="border-y-[1px] border-black text-[14px]">
              <tr>
                <th className="font-normal py-2">TT</th>
                <th className="font-normal py-2">Tên sản phẩm</th>
                <th className="font-normal py-2">SL</th>
                <th className="font-normal py-2">Đ.Giá</th>
                <th className="font-normal py-2">T.Tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => {
                return (
                  <tr className="text-[12px]" key={item.id}>
                    <td align="center">{index + 1}</td>
                    <td width={140}>{`${item.product.name} (${optionToString(
                      item
                    )})`}</td>
                    <td align="center">{item.quantity}</td>
                    <td align="center">
                      {currencyFormatter.format(
                        item.price +
                          calcProductOptionMoney(item.order_item_options)
                      )}
                    </td>
                    <td align="center">
                      {currencyFormatter.format(calcProductTotalMoney(item))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <OrderInvoice orderItems={order.orderItems} />
          <div className="font-semibold italic text-center text-[12px] mt-4">
            Cảm ơn và hẹn gặp lại
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(OrderPrint);
