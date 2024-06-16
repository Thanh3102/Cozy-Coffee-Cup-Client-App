import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faPlus,
  faRotate,
  faRotateRight,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { toast } from "react-toastify";
import FormAddOrder from "../feature/forms/FormAddOrder";
import axiosClient from "../../lib/axios";
import { formatDate } from "../../utils/dateFormat";
import { SubmitHandler, useForm } from "react-hook-form";
import { OrderStatus, OrderType } from "../../utils/types/enum";
import { motion } from "framer-motion";
import FormEditOrder from "../feature/forms/FormEditOrder";
import { getValue } from "@testing-library/user-event/dist/utils";
import FormOrderPayment from "../feature/forms/FormOrderPayment";

type Order = {
  id: number;
  note: string;
  created_at: Date;
  status: OrderStatus;
};

type FilterInput = {
  id?: string;
  startDate: string;
  endDate: string;
  status: OrderStatus;
  type: OrderType | "";
};

const OrderContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const orderTypeKeys = Object.keys(OrderType) as (keyof typeof OrderType)[];
  const orderStatusKeys = Object.keys(
    OrderStatus
  ) as (keyof typeof OrderStatus)[];

  const buttonAnimationVariants = {
    whileHover: { scale: 1.1, cursor: "pointer" },
    whileTap: { scale: 0.9 },
  };

  const fetchOrders = async (
    startDate: string = new Date().toISOString().split("T")[0],
    endDate: string = new Date().toISOString().split("T")[0],
    status: OrderStatus | "" = OrderStatus.UNPAID,
    type: OrderType | "" = "",
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
      setOrders(orders);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
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

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <ContentContainer>
      <div className="flex justify-between items-center pb-4 border-b-2">
        <span className="font-semibold text-[24px]">Hóa đơn</span>
        <div className="flex gap-4">
          <Button
            size="small"
            color="success"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => setOpenAdd(true)}
          >
            Tạo hóa đơn mới
          </Button>
        </div>
      </div>
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
      <div className="mt-2 shadow-md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.status === OrderStatus.PAID ? (
                    "Đã thanh toán"
                  ) : (
                    <span className="font-medium text-red-500">
                      Chưa thanh toán
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  {order.status === OrderStatus.PAID ? (
                    <div className="flex items-center justify-center">
                      <FontAwesomeIcon icon={faEye} />
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center justify-center">
                      <motion.div
                        whileHover={"whileHover"}
                        whileTap={"whileTap"}
                        variants={buttonAnimationVariants}
                        className="hover:text-blue-500"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedOrderId(order.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} title="Chỉnh sửa" />
                      </motion.div>
                      <motion.div
                        whileHover={"whileHover"}
                        whileTap={"whiletap"}
                        variants={buttonAnimationVariants}
                        className="hover:text-red-500"
                        onClick={() => {
                          setOpenDeleteConfirm(true);
                          setSelectedOrderId(order.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} title="Xóa" />
                      </motion.div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal open={openAdd}>
        <FormAddOrder close={() => setOpenAdd(false)} refreshFilter={refreshFilter}/>
      </Modal>
      {selectedOrderId && (
        <Modal open={openEdit}>
          <FormEditOrder
            id={selectedOrderId}
            close={() => setOpenEdit(false)}
          />
        </Modal>
      )}
      <Modal open={openDeleteConfirm}>
        <h1>Form xác nhận xóa</h1>
      </Modal>
    </ContentContainer>
  );
};

const Order = () => {
  return (
    <Fragment>
      <Sidebar />
      <OrderContent />
    </Fragment>
  );
};

export default Order;
