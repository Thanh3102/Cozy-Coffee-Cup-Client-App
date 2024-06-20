import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import ProductApi from "../../../api/Product";

interface Props extends BaseProps {
  close: () => void;
  fetchProductType: () => void;
}

type Inputs = { name: string };

const FormAddProductType = ({ close, fetchProductType }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const productApi = new ProductApi();
      const message = await productApi.createType(data);
      message && toast.success(message);
      fetchProductType();
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

export default FormAddProductType;
