import { Fragment } from "react/jsx-runtime";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";
import Button from "../../ui/Button";
import ProductApi from "../../../api/Product";

interface Props extends BaseProps {
  close: () => void;
  fetchCategories: () => void;
}

type Inputs = { name: string };

const FormAddCategory = ({ close, fetchCategories }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const productApi = new ProductApi();
    const message = await productApi.createCategory(data);
    message && toast.success(message);
    fetchCategories();
    close();
  };
  return (
    <Fragment>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Tên danh mục</label>
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

export default FormAddCategory;
