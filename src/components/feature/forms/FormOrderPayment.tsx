import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrderDetail, PaymentMethod } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import OrderApi from "../../../api/Order";
import OrderItemPaymentTable from "../tables/TableOrderItemPayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faX } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../ui/Loading";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import OrderInvoice from "../OrderInvoice";

interface Props extends BaseProps {
  orderId: number;
  close: () => void;
  fetchOrders: () => void;
}

type Inputs = {
  id: number;
  paymentMethod: number;
  paymentAt: Date;
};

const FormOrderPayment = ({ orderId, close, fetchOrders }: Props) => {
  const [order, setOrder] = useState<OrderDetail>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const { register, handleSubmit, getValues } = useForm<Inputs>({
    defaultValues: {
      paymentAt: new Date(),
      id: orderId,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const orderApi = new OrderApi();
    const message = await orderApi.payOrder(data);
    if (message !== null) {
      toast.success(message ?? "Thanh toán hóa đơn thành công");
    }
    fetchOrders();
    close();
  };

  const fetchOrderData = async () => {
    const orderApi = new OrderApi();
    const order = await orderApi.getOrderDetail(orderId);
    if (order) setOrder(order);
  };

  const fetchPaymentMethod = async () => {
    const orderApi = new OrderApi();
    const paymentMethods = await orderApi.getPaymentMethod();
    setPaymentMethods(paymentMethods);
  };

  useEffect(() => {
    fetchOrderData();
    fetchPaymentMethod();
  }, []);

  return order ? (
    <Fragment>
      <div className="w-[80vw] h-[80vh] flex">
        <div className="flex-[2] flex flex-col">
          <OrderItemPaymentTable orderItems={order.orderItems} />
        </div>
        <div className="h-full w-[1px] bg-gray-600 mx-5"></div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overscroll-y-auto">
            <h1 className="font-bold text-[24px]">Thanh toán hóa đơn</h1>
            <p className="font-semibold">Mã hóa đơn: {order.id}</p>
            <p className="font-semibold">
              Ngày tạo: {formatDate(order.created_at)}
            </p>
            <p className="font-semibold">Phương thức: {order.type}</p>
            <p className="font-semibold">
              Ghi chú: {order.note ? order.note : "Không có ghi chú"}
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="formOrderPayment"
              className="my-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="">Hình thức thanh toán</label>
                <select
                  id=""
                  className="input"
                  {...register("paymentMethod", {
                    required: true,
                    valueAsNumber: true,
                  })}
                >
                  <option value="" hidden>
                    Chọn hình thức
                  </option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.type}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <OrderInvoice orderItems={order.orderItems} />
          </div>
          <div className="my-2 flex gap-4 justify-end">
            <Button
              size="small"
              color="danger"
              type="button"
              onClick={close}
              icon={<FontAwesomeIcon icon={faX} />}
            >
              Đóng
            </Button>
            <Button
              size="small"
              color="success"
              type="button"
              icon={<FontAwesomeIcon icon={faMoneyCheckDollar} />}
              onClick={() => {
                getValues("paymentMethod")
                  ? setOpenConfirm(true)
                  : toast.warn("Chưa chọn hình thức thanh toán");
              }}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
      <Modal open={openConfirm}>
        <ModalTitle>Xác nhận thanh toán</ModalTitle>
        <ModalDescription>
          Bạn chắc chắn muốn thanh toán hóa đơn này ?
        </ModalDescription>
        <div className="flex gap-4 justify-center items-center">
          <Button
            size="small"
            color="danger"
            icon={<FontAwesomeIcon icon={faX} />}
            onClick={() => setOpenConfirm(false)}
          >
            Đóng
          </Button>
          <Button
            size="small"
            color="success"
            type="submit"
            form="formOrderPayment"
            icon={<FontAwesomeIcon icon={faMoneyCheckDollar} />}
          >
            Thanh toán
          </Button>
        </div>
      </Modal>
    </Fragment>
  ) : (
    <Loading />
  );
};

export default FormOrderPayment;
