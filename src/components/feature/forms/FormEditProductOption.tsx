import { SubmitHandler, useForm } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPlus,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../ui/Modal";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { SetStateAction, useEffect, useState } from "react";
import { currencyFormatter } from "../../../utils/currencyFormat";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";

interface Props extends BaseProps {
  id: number;
  closeModal: () => void;
  fetchOptions: () => void;
}

interface Inputs {
  id: number;
  title: string;
  required: boolean;
  allows_multiple: boolean;
}

type Value = { id: number; name: string; price: number };
type Option = {
  id: number;
  title: string;
  required: boolean;
  allows_multiple: boolean;
  values: Value[];
};

const FormEditProductOption = ({ id, closeModal, fetchOptions }: Props) => {
  const [openAddValue, setOpenAddValue] = useState<boolean>(false);
  const [option, setOption] = useState<Option>();
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  const fetchOption = async () => {
    try {
      const { option } = await axiosClient.get<void, { option: Option }>(
        `/api/product/getOptionById?id=${id}`
      );
      setOption(option);
      setValue("id", option.id);
      setValue("title", option.title);
      setValue("required", option.required);
      setValue("allows_multiple", option.allows_multiple);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { message } = await axiosClient.post<Inputs, { message: string }>(
        "/api/product/updateOption",
        data
      );
      toast.success(message);
      fetchOptions();
      closeModal();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchOption();
  }, []);

  return (
    <Fragment>
      <form
        className="min-w-[25vw]"
        onSubmit={handleSubmit(onSubmit)}
        id="formAddProductOption"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">Tiêu đề</label>
          <input
            type="text"
            className="input"
            {...register("title", { required: true })}
          />
        </div>
      </form>
      <div className="flex justify-between mt-2">
        <h4>Giá trị</h4>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          size="tiny"
          color="success"
          onClick={() => setOpenAddValue(true)}
        />
      </div>
      <Table height={200}>
        <TableHead sticky>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Giá tiền</TableCell>
            <TableCell align="center">Xóa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {option?.values.map((value, index) => (
            <TableRow key={index}>
              <TableCell>{value.name}</TableCell>
              <TableCell>{currencyFormatter.format(value.price)}</TableCell>
              <TableCell align="center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="hover:text-red-500 hover:cursor-pointer"
                  onClick={() => {
                    toast.info("Chưa hoàn thiện");
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex my-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            className="w-5 h-5"
            type="checkbox"
            id="product_option_required"
            {...register("required")}
          />
          <label htmlFor="product_option_required">Bắt buộc</label>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <input
            className="w-5 h-5"
            type="checkbox"
            id="product_option_allows_multiple"
            {...register("allows_multiple")}
          />
          <label htmlFor="product_option_allows_multiple">
            Chọn nhiều giá trị
          </label>
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-2">
        <Button
          size="small"
          icon={<FontAwesomeIcon icon={faX} />}
          color="danger"
          onClick={closeModal}
        >
          Đóng
        </Button>
        <Button
          form="formAddProductOption"
          size="small"
          type="submit"
          color="success"
          icon={<FontAwesomeIcon icon={faFloppyDisk} />}
        >
          Lưu
        </Button>
      </div>
      <Modal open={openAddValue}>
        <FormAddProductOptionValue close={() => setOpenAddValue(false)} />
      </Modal>
    </Fragment>
  );
};

interface ValueInputs {
  name: string;
  price: number;
}
interface ValueProps extends BaseProps {
  close: () => void;
}
const FormAddProductOptionValue = ({ close }: ValueProps) => {
  const { register, handleSubmit } = useForm<ValueInputs>();
  const onSubmit: SubmitHandler<ValueInputs> = async (data) => {};
  return (
    <Fragment>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Tên</label>
          <input
            type="text"
            className="input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Giá tiền</label>
          <input
            type="text"
            className="input"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button size="small" type="button" color="danger" onClick={close}>
            Đóng
          </Button>
          <Button size="small" type="submit" color="success">
            Thêm
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default FormEditProductOption;
