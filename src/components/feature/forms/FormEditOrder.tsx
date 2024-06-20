import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArchive,
  faMinus,
  faMoneyBill1Wave,
  faPlus,
  faSquareMinus,
  faSquarePlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../ui/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import { AnimatePresence, motion } from "framer-motion";
import OrderProductSelect from "../OrderProductSelect";
import { currencyFormatter } from "../../../utils/currencyFormat";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import { OrderStatus, OrderType } from "../../../utils/types/enum";
import { Option, OrderDetail, OrderItem } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import FormOrderPayment from "./FormOrderPayment";
import { UpdateOrderDto } from "../../../utils/types/dto";
import OrderApi from "../../../api/Order";

interface Props extends BaseProps {
  id: number;
  close: () => void;
}

type Inputs = {
  note: string;
  type: OrderType;
  total: number;
};

const FormEditOrder = ({ id, close }: Props) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [deleteitemIndex, setDeleteitemIndex] = useState(-1);
  const [deleteId, setDeleteId] = useState<Array<number>>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (orderItems.length === 0) {
      toast.error("Hoá đơn không có sản phẩm nào. Vui lòng kiểm tra lại");
      return;
    }

    const dto: UpdateOrderDto = {
      ...data,
      id: id,
      items: orderItems,
      deleteItems: deleteId,
    };
    const orderApi = new OrderApi();
    const message = await orderApi.updateOrder(dto);
    if (message) {
      toast.success(message);
    }
    close();
  };

  const convertValueToString = (option: Option) => {
    return option.values.map((v) => v.name);
  };

  const handleIncreaseButton = (_index: number) => {
    setOrderItems((orderItems) => {
      let increaseOption = orderItems.find((_, index) => index === _index);
      let increaseOptionIndex = orderItems.findIndex(
        (_, index) => index === _index
      );
      if (increaseOption !== undefined) {
        if (increaseOption.quantity === 99) {
          toast.warning("Số lượng sản phẩm không quá 99");
          return orderItems;
        } else {
          const newOption = {
            ...increaseOption,
            quantity: increaseOption.quantity + 1,
          };
          const newOrderItems = [];
          for (let index in orderItems) {
            if (parseInt(index) !== increaseOptionIndex)
              newOrderItems.push(orderItems[index]);
            else newOrderItems.push(newOption);
          }
          return newOrderItems;
        }
      }
      return orderItems;
    });
  };

  const handleDecreaseButton = (_index: number) => {
    setOrderItems((orderItems) => {
      let decreaseOption = orderItems.find((_, index) => index === _index);
      let decreaseOptionIndex = orderItems.findIndex(
        (_, index) => index === _index
      );
      if (decreaseOption !== undefined) {
        if (decreaseOption.quantity === 1) {
          toast.warning("Số lượng sản phẩm nhỏ nhất là 1");
          return orderItems;
        } else {
          const newOption = {
            ...decreaseOption,
            quantity: decreaseOption.quantity - 1,
          };
          const newOrderItems = [];
          for (let index in orderItems) {
            if (parseInt(index) !== decreaseOptionIndex)
              newOrderItems.push(orderItems[index]);
            else newOrderItems.push(newOption);
          }
          return newOrderItems;
        }
      }
      return orderItems;
    });
  };

  const handleDeleteButton = () => {
    const id = orderItems[deleteitemIndex].id;
    if (id) {
      setDeleteId((deleteId) => {
        let newArray = deleteId;
        newArray.push(id);
        return newArray;
      });
    }
    setOrderItems((orderItems) => {
      return orderItems.filter((item, index) => index !== deleteitemIndex);
    });
    setOpenDelete(false);
  };

  const calcProductTotalMoney = (item: OrderItem): number => {
    const price = item.price;
    const discount = item.discount;
    const quantity = item.quantity;
    let optionPrice = 0;
    for (let option of item.options) {
      optionPrice += option.values.reduce((total, value) => {
        return total + value.price;
      }, 0);
    }
    if (discount != 0)
      return ((price * discount) / 100 + optionPrice) * quantity;
    return (price + optionPrice) * quantity;
  };

  const calcOrderTotalMoney = () => {
    const total = orderItems.reduce((total, item) => {
      if (!item.is_gift) {
        return total + calcProductTotalMoney(item);
      }
      return total;
    }, 0);
    setValue("total", total);
    return total;
  };

  const fetchOrderData = async () => {
    try {
      const { order } = await axiosClient.get<void, { order: OrderDetail }>(
        "/api/order/getOrderDetail",
        {
          params: {
            id: id,
          },
        }
      );
      setOrderDetail(order);
      setOrderItems(
        order.orderItems.map((item) => {
          const options = item.order_item_options.map((option) => {
            const values = option.order_item_option_values.map((value) => {
              return {
                id: value.id,
                name: value.name,
                price: value.price,
              };
            });
            return {
              id: option.id,
              title: option.title,
              values: values,
            };
          });
          return {
            id: item.id,
            product_id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            is_gift: item.isGift,
            options: options,
          };
        })
      );
      setValue("type", order.type);
      setValue("note", order.note);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const orderTypeKeys = Object.keys(OrderType) as (keyof typeof OrderType)[];

  return (
    <Fragment>
      {orderDetail ? (
        <Fragment>
          <div className="flex min-w-[80vw] min-h-[80vh]">
            <div className="flex-[6]">
              <div className="flex gap-4 items-center">
                <h1 className="font-semibold text-[18px]">Sản phẩm</h1>
                <Button
                  size="small"
                  color="success"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setOpenAdd(true)}
                />
              </div>
              <div className="max-h-[80vh] overflow-y-scroll">
                <Table>
                  <TableHead sticky>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Tùy chọn</TableCell>
                      <TableCell>Xóa</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={index} className="select-none">
                        <TableCell>
                          {item.name + `${item.is_gift ? "(Tặng kèm)" : ""}`}
                        </TableCell>
                        <TableCell>
                          {currencyFormatter.format(
                            calcProductTotalMoney(item)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-black flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FontAwesomeIcon
                                icon={faSquareMinus}
                                className="hover:cursor-pointer hover:text-red-400"
                                onClick={() => handleDecreaseButton(index)}
                              />
                            </motion.div>
                            <p className="w-10 text-center">{item.quantity}</p>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FontAwesomeIcon
                                icon={faSquarePlus}
                                className="hover:cursor-pointer hover:text-green-400"
                                onClick={() => handleIncreaseButton(index)}
                              />
                            </motion.div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[15vw] whitespace-nowrap overflow-hidden relative group/options">
                          <ul className="list-disc">
                            {item.options.map((opt) => (
                              <li key={opt.id}>{`${
                                opt.title
                              }: ${convertValueToString(opt)}`}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-red-500 hover:cursor-pointer hover:underline"
                            onClick={() => {
                              setDeleteitemIndex(index);
                              setOpenDelete(true);
                            }}
                          >
                            Xóa
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="w-[2px] bg-gray-400 mx-5"></div>
            <div className="flex-[4]">
              <h1 className="font-semibold text-[20px]">Thông tin hóa đơn</h1>
              <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 my-2">
                  <div className="flex">
                    <p className="flex-1 font-medium">Mã hóa đơn:</p>
                    <p className="flex-[3]">{orderDetail.id}</p>
                  </div>
                  <div className="flex">
                    <p className="flex-1 font-medium">Thời gian tạo:</p>
                    <p className="flex-[3]">
                      {formatDate(orderDetail.created_at)}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="flex-1 font-medium">Trạng thái:</p>
                    <p className="flex-[3]">{orderDetail.status}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <label htmlFor="" className="font-medium">
                    Phương thức
                  </label>
                  <select className="input" {...register("type")}>
                    {orderTypeKeys.map((key) => (
                      <option key={key} value={OrderType[key]}>
                        {OrderType[key]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-medium">
                    Ghi chú
                  </label>
                  <textarea
                    cols={5}
                    rows={4}
                    className="input resize-none"
                    {...register("note")}
                  />
                </div>
                <div className="my-2">
                  <span className="font-medium">
                    Tổng tiền: {currencyFormatter.format(calcOrderTotalMoney())}
                  </span>
                </div>
                <div className="my-2 flex justify-end gap-4">
                  <Button
                    size="small"
                    color="danger"
                    type="button"
                    icon={<FontAwesomeIcon icon={faX} />}
                    onClick={close}
                  >
                    Đóng
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    type="button"
                    icon={<FontAwesomeIcon icon={faMoneyBill1Wave} />}
                    onClick={() => setOpenPayment(true)}
                  >
                    Thanh toán
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    color="success"
                    icon={<FontAwesomeIcon icon={faFileArchive} />}
                  >
                    Lưu
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <Modal open={openAdd}>
            <OrderProductSelect
              close={() => setOpenAdd(false)}
              setOrderItems={setOrderItems}
            />
          </Modal>
          <Modal open={openDelete}>
            <h5 className="font-medium text-[20px]">Xác nhận xóa ?</h5>
            <p className="my-2">Bạn muốn xóa sản phẩm này khỏi hóa đơn ?</p>
            <div className="flex gap-4 justify-end">
              <Button size="small" onClick={() => setOpenDelete(false)}>
                Hủy
              </Button>
              <Button
                size="small"
                color="danger"
                onClick={() => handleDeleteButton()}
              >
                Xóa
              </Button>
            </div>
          </Modal>
          <Modal open={openPayment}>
            <FormOrderPayment
              orderId={id}
              close={() => setOpenPayment(false)}
              closeAll={() => {
                setOpenPayment(false);
                close();
              }}
            />
          </Modal>
        </Fragment>
      ) : (
        <h1>Loading</h1>
      )}
    </Fragment>
  );
};

export default FormEditOrder;
