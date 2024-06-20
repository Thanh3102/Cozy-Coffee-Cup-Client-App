import { SubmitHandler, useForm } from "react-hook-form";
import { OrderStatus, OrderType } from "../../../utils/types/enum";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faRotateRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  fetchOrders: (
    startDate: string,
    endDate: string,
    status: OrderStatus | "",
    type: OrderType | "",
    id?: number
  ) => void;
}

type FilterInput = {
  id?: string;
  startDate: string;
  endDate: string;
  status: OrderStatus;
  type: OrderType | "";
};

const FormFilterOrder = ({ fetchOrders }: Props) => {
  const { register, handleSubmit, setValue, getValues } = useForm<FilterInput>({
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      status: OrderStatus.UNPAID,
      type: "",
    },
  });

  const onSubmit: SubmitHandler<FilterInput> = async (data) => {
    try {
      fetchOrders(
        data.startDate,
        data.endDate,
        data.status,
        data.type,
        data.id ? parseInt(data.id) : undefined
      );
    } catch (error) {
      toast.error("Mã hóa đơn không hợp lệ");
    }
  };

  const resetFilter = () => {
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    const status = OrderStatus.UNPAID;
    const type = "";
    const id = "";
    setValue("startDate", startDate);
    setValue("endDate", endDate);
    setValue("status", status);
    setValue("type", type);
    setValue("id", id);
    fetchOrders(startDate, endDate, status, type);
  };

  const refreshFilter = () => {
    const id = getValues("id");
    try {
      fetchOrders(
        getValues("startDate"),
        getValues("endDate"),
        getValues("status"),
        getValues("type"),
        id ? parseInt(id) : undefined
      );
    } catch (error) {
      toast.error("Mã hóa đơn không hợp lệ");
    }
  };

  const orderTypeKeys = Object.keys(OrderType) as (keyof typeof OrderType)[];
  const orderStatusKeys = Object.keys(
    OrderStatus
  ) as (keyof typeof OrderStatus)[];

  return (
    <div className="bg-white p-4 my-4 rounded-md shadow-md">
      <form
        id="orderFilterForm"
        className="flex flex-wrap  items-center -mx-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-[20%] flex flex-col gap-2 px-2">
          <label htmlFor="">Mã hóa đơn</label>
          <input
            type="text"
            className="input"
            {...register("id", { valueAsNumber: true })}
          />
        </div>
        <div className="w-[20%] flex flex-col gap-2 px-2">
          <label htmlFor="">Ngày bắt đầu</label>
          <input
            type="date"
            className="input"
            min={"2020-01-01"}
            max={new Date().toISOString().split("T")[0]}
            {...register("startDate")}
          />
        </div>
        <div className="w-[20%] flex flex-col gap-2 px-2">
          <label htmlFor="">Ngày kết thúc</label>
          <input
            type="date"
            className="input"
            max={new Date().toISOString().split("T")[0]}
            {...register("endDate")}
          />
        </div>
        <div className="w-[20%] flex flex-col gap-2 px-2">
          <label htmlFor="">Trạng thái</label>
          <select {...register("status")} className="input">
            <option value="">Tất cả</option>
            {orderStatusKeys.map((key) => (
              <option key={key} value={OrderStatus[key]}>
                {OrderStatus[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="w-[20%] flex flex-col gap-2 px-2">
          <label htmlFor="">Phương thức</label>
          <select className="input" {...register("type")}>
            <option value="">Tất cả</option>
            {orderTypeKeys.map((key) => (
              <option key={key} value={OrderType[key]}>
                {OrderType[key]}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div className="mt-2 flex gap-4">
        <Button
          size="small"
          color="success"
          icon={<FontAwesomeIcon icon={faRotate} />}
          onClick={refreshFilter}
        >
          Làm mới
        </Button>
        <Button
          size="small"
          color="warning"
          icon={<FontAwesomeIcon icon={faRotateRight} />}
          onClick={resetFilter}
        >
          Đặt lại
        </Button>
        <Button
          size="small"
          type="submit"
          form="orderFilterForm"
          icon={<FontAwesomeIcon icon={faSearch} />}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default FormFilterOrder;
