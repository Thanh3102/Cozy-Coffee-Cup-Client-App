import {
  Fragment,
  ReactElement,
  ReactInstance,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ItemOption,
  OrderDetailItem,
  OrderDetail as TypeOrderDetail,
} from "../../utils/types/type";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
import { currencyFormatter } from "../../utils/currencyFormat";
import Loading from "../ui/Loading";
import OrderApi from "../../api/Order";
import OrderInvoice from "./OrderInvoice";
import { formatDate } from "../../utils/dateFormat";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faX } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import OrderPrint from "./OrderPrint";

interface Props {
  id: number;
  close: () => void;
}

const OrderDetail = ({ id, close }: Props) => {
  const [order, setOrder] = useState<TypeOrderDetail>();
  const fetchOrderDetail = async () => {
    const orderApi = new OrderApi();
    const order = await orderApi.getOrderDetail(id);
    setOrder(order);
  };

  const printComponetRef = useRef<ReactInstance>(null);

  const handlePrint = useReactToPrint({
    content: () => printComponetRef.current,
  });

  useEffect(() => {
    fetchOrderDetail();
  }, []);

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

  return order ? (
    <Fragment>
      <div className="hidden">
        <OrderPrint refer={printComponetRef} order={order} />
      </div>
      <div className="w-[80vw] h-[80vh] bg-white rounded-md flex gap-4">
        <div className="w-[40%] flex flex-col">
          <div className="flex-1">
            <h1 className="font-bold text-base lg:text-lg">Chi tiết hóa đơn</h1>
            <div className="text-sm lg:text-base">
              <p>
                Mã hóa đơn: <span className="font-semibold">{order.id}</span>
              </p>
              <p>
                Loại hóa đơn:{" "}
                <span className="font-semibold">{order.type}</span>
              </p>
              <p>
                Trạng thái:{" "}
                <span className="font-semibold">{order.status}</span>
              </p>
              <p>
                Thời gian tạo:{" "}
                <span className="font-semibold">
                  {formatDate(order.created_at)}
                </span>
              </p>
              <p>
                Thời gian thanh toán:{" "}
                <span className="font-semibold">
                  {formatDate(order.payment_at)}
                </span>
              </p>
              <p>
                Hình thức thanh toán:{" "}
                <span className="font-semibold">{order.payment.type}</span>
              </p>
              <p>
                Người tạo:{" "}
                <span className="font-semibold">{order.user.name}</span>
              </p>
              <p>
                Người thanh toán:{" "}
                <span className="font-semibold">{order.paymentUser.name}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              size="small"
              color="danger"
              onClick={close}
              icon={<FontAwesomeIcon icon={faX} />}
            >
              Đóng
            </Button>
            <Button
              size="small"
              color="warning"
              onClick={handlePrint}
              icon={<FontAwesomeIcon icon={faPrint} />}
            >
              In hóa đơn
            </Button>
          </div>
        </div>
        <div className="w-[1px] h-full bg-gray-200 mx-2"></div>
        <div className="w-[60%]">
          <Table height={"70%"}>
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
              {order.orderItems.map((orderItem, index) => {
                return (
                  <TableRow key={orderItem.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-[13px] relative font-medium">
                      {`${orderItem.product.name} (${optionToString(
                        orderItem
                      )})`}
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
                      {!orderItem.is_gift
                        ? currencyFormatter.format(
                            calcProductTotalMoney(orderItem)
                          )
                        : currencyFormatter.format(0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <OrderInvoice orderItems={order.orderItems} />
        </div>
      </div>
    </Fragment>
  ) : (
    <Loading />
  );
};

export default OrderDetail;
