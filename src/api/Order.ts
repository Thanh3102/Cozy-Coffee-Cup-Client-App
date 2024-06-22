import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import { OrderStatus, OrderType } from "../utils/types/enum";
import { Order, OrderDetail, PaymentMethod } from "../utils/types/type";
import {
  CreateOrderDto,
  PayOrderDto,
  UpdateOrderDto,
} from "../utils/types/dto";

export default class OrderApi {
  getOrderByFilter = async (
    startDate: string,
    endDate: string,
    status: OrderStatus | "",
    type: OrderType | "",
    id?: number
  ) => {
    try {
      const { orders } = await axiosClient.get<any, { orders: Order[] }>(
        "/api/order/getOrderByFilter",
        {
          params: {
            startDate: startDate,
            endDate: endDate,
            status: status,
            type: type,
            id: id ?? "",
          },
        }
      );
      return orders;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  getOrderDetail = async (id: number) => {
    try {
      const { order } = await axiosClient.get<void, { order: OrderDetail }>(
        "/api/order/getOrderDetail",
        {
          params: {
            id: id,
          },
        }
      );
      return order;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  getPaymentMethod = async () => {
    try {
      const { paymentMethods } = await axiosClient.get<
        void,
        { paymentMethods: PaymentMethod[] }
      >("/api/order/getPaymentMethod");

      return paymentMethods;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy phương thức thanh toán");
      return [];
    }
  };

  createOrder = async (dto: CreateOrderDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateOrderDto,
        { message: string }
      >("/api/order/createOrder", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  updateOrder = async (dto: UpdateOrderDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateOrderDto,
        { message: string }
      >("/api/order/updateOrder", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  deleteOrder = async (id: number) => {
    try {
      const { message } = await axiosClient.delete<number, { message: string }>(
        "/api/order/deleteOrder",
        {
          params: {
            id: id,
          },
        }
      );
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  payOrder = async (dto: PayOrderDto) => {
    try {
      const { message } = await axiosClient.post<
        PayOrderDto,
        { message: string }
      >("/api/order/payOrder", dto);
      return message;
    } catch (error: any) {
      toast.error(
        error.messsage ?? "Thanh toán không thành công. Đã có lỗi xảy ra"
      );
    }
  };
}
