import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";
import { Category } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  category: Category;
  close: () => void;
  fetchCategories: () => void;
}

const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Chưa nhập tên danh mục" }),
});

type Inputs = z.infer<typeof categorySchema>;

const FormEditCategory = ({ category, close, fetchCategories }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(categorySchema),
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
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
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
