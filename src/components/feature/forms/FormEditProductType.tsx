import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ProductType } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  type: ProductType;
  close: () => void;
  fetchType: () => void;
}

const productTypeSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
});

type Inputs = z.infer<typeof productTypeSchema>;

const FormEditProductType = ({ type, close, fetchType }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: { name: type.name, id: type.id },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const productApi = new ProductApi();
      const message = await productApi.updateType(data);
      message && toast.success(message);
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
            {...register("name")}
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

export default FormEditProductType;
