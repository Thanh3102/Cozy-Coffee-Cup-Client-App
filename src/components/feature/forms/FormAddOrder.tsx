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
  faMinus,
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
import { Option, OrderItem } from "../../../utils/types/type";
import { currencyFormatter } from "../../../utils/currencyFormat";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import { OrderType } from "../../../utils/types/enum";
import { CreateOrderDto } from "../../../utils/types/dto";
import OrderApi from "../../../api/Order";

interface Props extends BaseProps {
  close: () => void;
  fetchOrders: () => void;
}

type Inputs = {
  note: string;
  type: OrderType;
  total: number;
};

const FormAddOrder = ({ close, fetchOrders }: Props) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteitemIndex, setDeleteitemIndex] = useState(-1);
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: {
      type: OrderType.OnSite,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (orderItems.length === 0) {
      toast.error("Chưa thêm sản phẩm");
      return;
    }
    const dto: CreateOrderDto = {
      ...data,
      items: orderItems,
    };

    const orderApi = new OrderApi();
    const message = await orderApi.createOrder(dto);
    if (message) {
      toast.success(message);
    }
    fetchOrders();
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
    setOrderItems((orderItems) =>
      orderItems.filter((item, index) => index !== deleteitemIndex)
    );
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

  const orderTypeKeys = Object.keys(OrderType) as (keyof typeof OrderType)[];

  return (
    <Fragment>
      <div className="flex w-[80vw] h-[80vh] min-h-[500px] md:min-h-[600px] min-w-[600px] flex-col lg:flex-row">
        <div className="flex-1 md:flex-[6] flex flex-col">
          <div className="flex gap-4 items-center">
            <h1 className="font-semibold text-lg">Sản phẩm</h1>
            <Button
              size="small"
              color="success"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setOpenAdd(true)}
            />
          </div>
          <div className="flex-1">
            <div className="h-[250px] lg:h-[70vh] overflow-y-auto">
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
                      <TableCell className="text-sm">
                        {item.name + `${item.is_gift ? "(Tặng kèm)" : ""}`}
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(calcProductTotalMoney(item))}
                      </TableCell>
                      <TableCell>
                        <div className="text-black flex items-center">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FontAwesomeIcon
                              icon={faSquareMinus}
                              className="hover:cursor-pointer hover:text-red-400 sm:text-base"
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
                              className="hover:cursor-pointer hover:text-green-400 sm:text-base"
                              onClick={() => handleIncreaseButton(index)}
                            />
                          </motion.div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[15vw] whitespace-nowrap overflow-hidden relative group/options text-[12px]">
                        <ul className="list-disc">
                          {item.options.map((opt) => (
                            <li>{`${opt.title}: ${convertValueToString(
                              opt
                            )}`}</li>
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
        </div>
        <div className=" w-full h-[1px] my-2 bg-gray-400 lg:mx-5 lg:my-0 lg:w-[1px] lg:h-full"></div>
        <div className="flex-1 md:flex-[4]">
          <h1 className="font-semibold text-[18px]">Thông tin hóa đơn</h1>
          <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4 items-center">
              <label htmlFor="">Phương thức</label>
              <select className="input" {...register("type")}>
                {orderTypeKeys.map((key) => (
                  <option key={key} value={OrderType[key]}>
                    {OrderType[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Ghi chú</label>
              <textarea
                cols={5}
                rows={4}
                className="input resize-none"
                {...register("note")}
              />
            </div>
            <div className="my-2">
              <span className="font-medium">
                Thành tiền: {currencyFormatter.format(calcOrderTotalMoney())}
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
                color="success"
                type="submit"
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                Tạo hóa đơn
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
        <h5 className="font-medium text-lg">Xác nhận xóa ?</h5>
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
    </Fragment>
  );
};

export default FormAddOrder;
