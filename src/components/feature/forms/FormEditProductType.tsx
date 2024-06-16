import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import { ProductType } from "../../../utils/types/type";

interface Props extends BaseProps {
  type: ProductType;
  close: () => void;
  fetchType: () => void;
}

type Inputs = { id: number; name: string };

const FormEditProductType = ({ type, close, fetchType }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: { name: type.name, id: type.id },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { message } = await axiosClient.post<Inputs, { message: string }>(
        "/api/product/updateType",
        data
      );
      toast.success(message);
      fetchType();
      close();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };
  return (
    <Fragment>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Tên loại sản phẩm</label>
          <input
            type="text"
            className="input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" size="small" color="danger" onClick={close}>
            Đóng
          </Button>
          <Button type="submit" size="small">
            Lưu
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default FormEditProductType;
