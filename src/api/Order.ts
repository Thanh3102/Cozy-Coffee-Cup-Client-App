import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import { OrderStatus, OrderType } from "../utils/types/enum";
import { Order } from "../utils/types/type";
import { CreateOrderDto, UpdateOrderDto } from "../utils/types/dto";

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
}
