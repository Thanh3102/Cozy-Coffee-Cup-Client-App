import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import { Provider } from "../utils/types/type";
import { CreateProviderDto, UpdateProviderDto } from "../utils/types/dto";

export default class ProviderApi {
  getAll = async () => {
    try {
      const { providers } = await axiosClient.get<
        void,
        { providers: Provider[] }
      >("/api/provider/getAll");
      return providers;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  getAllActive = async () => {
    try {
      const { providers } = await axiosClient.get<
        void,
        { providers: Provider[] }
      >("/api/provider/getAllActive");
      return providers;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  create = async (dto: CreateProviderDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateProviderDto,
        { message: string }
      >("/api/provider/create", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  update = async (dto: UpdateProviderDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateProviderDto,
        { message: string }
      >("/api/provider/update", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };
}
