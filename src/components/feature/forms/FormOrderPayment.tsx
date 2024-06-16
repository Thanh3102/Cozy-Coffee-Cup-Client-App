import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import { useEffect, useState } from "react";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { OrderDetail, PaymentMethod } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props extends BaseProps {
  orderId: number;
  close: () => void;
  closeAll: () => void;
}

type Inputs = {
  id: number;
  paymentMethod: number;
  paymentAt: Date;
};

const FormOrderPayment = ({ orderId, close, closeAll }: Props) => {
  const [order, setOrder] = useState<OrderDetail>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      paymentAt: new Date(),
      id: orderId,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { message } = await axiosClient.post<Inputs, { message: string }>(
      "/api/order/payOrder",
      data
    );
    toast.success(message);
    closeAll();
    try {
    } catch (error: any) {
      toast.error(
        error.messsage ?? "Thanh toán không thành công. Đã có lỗi xảy ra"
      );
    }
  };

  const fetchOrderData = async () => {
    try {
      const { order } = await axiosClient.get<void, { order: OrderDetail }>(
        "/api/order/getOrderDetail",
        {
          params: {
            id: orderId,
          },
        }
      );
      setOrder(order);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const { paymentMethods } = await axiosClient.get<
        void,
        { paymentMethods: PaymentMethod[] }
      >("/api/order/getPaymentMethod");

      setPaymentMethods(paymentMethods);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy phương thức thanh toán");
    }
  };

  useEffect(() => {
    fetchOrderData();
    fetchPaymentMethod();
  }, []);

  return order ? (
    <Fragment>
      <div className="">
        <h1>Thanh toán</h1>
        <p>Mã hóa đơn: {order.id}</p>
        <p>Ngày tạo: {formatDate(order.created_at)}</p>
        <p>Phương thức: {order.type}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className="my-2 flex gap-4 justify-end">
          <Button size="small" color="danger" type="button" onClick={close}>
            Đóng
          </Button>
          <Button size="small" color="success" type="submit">
            Thanh toán
          </Button>
        </div>
      </form>
    </Fragment>
  ) : (
    <Fragment>Loading</Fragment>
  );
};

export default FormOrderPayment;
