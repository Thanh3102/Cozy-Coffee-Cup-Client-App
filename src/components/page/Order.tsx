import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import FormAddOrder from "../feature/forms/FormAddOrder";
import { OrderStatus, OrderType } from "../../utils/types/enum";
import OrderApi from "../../api/Order";
import FormFilterOrder from "../feature/forms/FormFilterOrder";
import OrderTable from "../feature/tables/TableOrder";
import { Order as TypeOrder } from "../../utils/types/type";
import { useForm } from "react-hook-form";

type FilterInput = {
  id?: string;
  startDate: string;
  endDate: string;
  status: OrderStatus | "";
  type: OrderType | "";
};

const OrderContent = () => {
  const [orders, setOrders] = useState<TypeOrder[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const filterForm = useForm<FilterInput>({
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      status: "",
      type: "",
    },
  });

  const fetchOrders = async (
    startDate: string = filterForm.getValues("startDate"),
    endDate: string = filterForm.getValues("endDate"),
    status: OrderStatus | "" = filterForm.getValues("status"),
    type: OrderType | "" = filterForm.getValues("type"),
    id?: number
  ) => {
    const orderApi = new OrderApi();
    const orders = await orderApi.getOrderByFilter(
      startDate,
      endDate,
      status,
      type,
      id
    );
    setOrders(orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

      <FormFilterOrder form={filterForm} fetchOrders={fetchOrders} />

      <OrderTable orders={orders} fetchOrders={fetchOrders} />

      <Modal open={openAdd}>
        <FormAddOrder
          close={() => setOpenAdd(false)}
          fetchOrders={fetchOrders}
        />
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
