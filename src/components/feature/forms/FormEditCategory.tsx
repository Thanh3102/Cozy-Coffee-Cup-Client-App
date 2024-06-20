import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import { Category } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";

interface Props extends BaseProps {
  category: Category;
  close: () => void;
  fetchCategories: () => void;
}

type Inputs = { id: number; name: string };

const FormEditCategory = ({ category, close, fetchCategories }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: { name: category.name, id: category.id },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const productApi = new ProductApi();
    const message = await productApi.updateCategory(data);
    message ?? toast.success(message);
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

export default FormEditCategory;
