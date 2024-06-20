import { Fragment } from "react/jsx-runtime";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../../ui/Table";
import { Order } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import { OrderStatus } from "../../../utils/types/enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "../../ui/Modal";
import FormEditOrder from "../forms/FormEditOrder";

interface Props {
  orders: Order[];
}

const OrderTable = ({ orders }: Props) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const buttonAnimationVariants = {
    whileHover: { scale: 1.1, cursor: "pointer" },
    whileTap: { scale: 0.9 },
  };
  return (
    <Fragment>
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
    </Fragment>
  );
};
export default OrderTable;
