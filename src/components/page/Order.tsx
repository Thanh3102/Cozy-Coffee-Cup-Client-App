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

const OrderContent = () => {
  const [orders, setOrders] = useState<TypeOrder[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  // const [openPayment, setOpenPayment] = useState<boolean>(false);

  const fetchOrders = async (
    startDate: string = new Date().toISOString().split("T")[0],
    endDate: string = new Date().toISOString().split("T")[0],
    status: OrderStatus | "" = OrderStatus.UNPAID,
    type: OrderType | "" = "",
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

      <FormFilterOrder fetchOrders={fetchOrders} />

      <OrderTable orders={orders} />

      <Modal open={openAdd}>
        <FormAddOrder
          close={() => setOpenAdd(false)}
          // refreshFilter={refreshFilter}
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
