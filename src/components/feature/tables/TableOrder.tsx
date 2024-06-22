import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { Order, PaymentMethod } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import { OrderStatus } from "../../../utils/types/enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMoneyCheckDollar,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditOrder from "../forms/FormEditOrder";
import FormOrderPayment from "../forms/FormOrderPayment";
import OrderDetail from "../OrderDetail";
import Button from "../../ui/Button";
import OrderApi from "../../../api/Order";
import { toast } from "react-toastify";

interface Props {
  orders: Order[];
  fetchOrders: () => void;
}

const OrderTable = ({ orders, fetchOrders }: Props) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const buttonAnimationVariants = {
    whileHover: { scale: 1.1, cursor: "pointer" },
    whileTap: { scale: 0.9 },
  };

  const handleDelete = async (id: number) => {
    const orderApi = new OrderApi();
    const message = await orderApi.deleteOrder(id);
    if (message !== null) {
      toast.success(message ?? "Đã xóa hóa đơn");
      setOpenDeleteConfirm(false);
      fetchOrders();
    }
  };

  return (
    <Fragment>
      <div className="mt-2 shadow-md">
        <Table height={"70vh"}>
          <TableHead bgColor={"#686D76"} sticky>
            <TableRow>
              <TableCell>Mã hóa đơn</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Phương thức</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>
                  {order.status === OrderStatus.PAID ? (
                    <span className="font-medium text-green-500">
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="font-medium text-red-500">
                      Chưa thanh toán
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  {order.status === OrderStatus.PAID ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        whileHover={"whileHover"}
                        whileTap={"whileTap"}
                        variants={buttonAnimationVariants}
                        className="hover:text-blue-500"
                        onClick={() => {
                          setOpenDetail(true);
                          setSelectedOrderId(order.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} title="Xem chi tiết" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center justify-center">
                      <motion.div
                        whileHover={"whileHover"}
                        whileTap={"whileTap"}
                        variants={buttonAnimationVariants}
                        className="hover:text-green-500"
                        onClick={() => {
                          setOpenPayment(true);
                          setSelectedOrderId(order.id);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faMoneyCheckDollar}
                          title="Thanh toán"
                        />
                      </motion.div>
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
      {selectedOrderId && (
        <Modal open={openEdit}>
          <FormEditOrder
            id={selectedOrderId}
            close={() => setOpenEdit(false)}
            fetchOrders={fetchOrders}
          />
        </Modal>
      )}
      {selectedOrderId && (
        <Modal open={openPayment}>
          <FormOrderPayment
            orderId={selectedOrderId}
            fetchOrders={fetchOrders}
            close={() => setOpenPayment(false)}
          />
        </Modal>
      )}
      {selectedOrderId && (
        <Modal open={openDetail}>
          <OrderDetail
            id={selectedOrderId}
            close={() => setOpenDetail(false)}
          />
        </Modal>
      )}
      {selectedOrderId && (
        <Modal open={openDeleteConfirm}>
          <ModalTitle>Xác nhận xóa ?</ModalTitle>
          <ModalDescription>
            Bạn chắc chắn muốn xóa hóa đơn này ?
          </ModalDescription>
          <div className="flex gap-4 justify-center">
            <Button
              size="small"
              icon={<FontAwesomeIcon icon={faX} />}
              onClick={() => setOpenDeleteConfirm(false)}
            >
              Hủy
            </Button>
            <Button
              size="small"
              color="danger"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() => handleDelete(selectedOrderId)}
            >
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};
export default OrderTable;
