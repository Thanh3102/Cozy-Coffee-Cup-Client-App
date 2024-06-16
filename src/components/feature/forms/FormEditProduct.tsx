import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import { Category, Product, ProductType } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";

interface Props extends BaseProps {
  product: Product;
  fetchProduct: () => void;
  close: () => void;
}

interface Inputs {
  name: string;
  price: number;
  type_id: number;
  category_id: number | null;
  description: string;
  note: string;
  image: File;
  discount: number;
  status: boolean;
}

const FormEditProduct = ({ product, close, fetchProduct }: Props) => {
  const [image, setImage] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(product);
  

  const { register, handleSubmit, setValue, reset } = useForm<Inputs>({
    defaultValues: {
      name: product.name,
      price: product.price,
      discount: product.discount,
      type_id: product.type.id,
      category_id: product?.category?.id ?? null,
      status: product.status,
      note: product.note,
      description: product.description,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const response = await axiosClient.post<
        Inputs,
        { status: number; message: string }
      >(
        "/api/product/update",
        { id: product.id, ...data },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      toast.success(response.message);
      fetchProduct();
      close();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { categories } = await axiosClient.get<
        void,
        { categories: Category[] }
      >("/api/product/getCategory");
      setCategories(categories);
      reset({ category_id: product?.category?.id ?? null });
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy danh mục");
    }
  };

  const fetchTypes = async () => {
    try {
      const { types } = await axiosClient.get<void, { types: ProductType[] }>(
        "/api/product/getType"
      );
      setTypes(types);
      reset({ type_id: product.type.id });
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy loại sản phẩm");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
    setImage(product.image);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      setImage(URL.createObjectURL(e.target.files[0]));
      setValue("image", e.target.files[0]);
    } catch (error) {}
  };

  return (
    <Fragment>
      <form
        className="min-w-[30vw] grid grid-rows-6 grid-cols-4 mt-2 gap-x-4 gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
        id="editProductForm"
      >
        <div className="grid col-span-1 gap-2">
          <label htmlFor="">Tên sản phẩm</label>
          <input
            type="text"
            className="input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="grid col-span-1 gap-2">
          <label htmlFor="">Giá tiền</label>
          <input
            type="text"
            className="input"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="grid col-span-1 gap-2 row-start-2">
          <label htmlFor="">Loại sản phẩm</label>
          <select
            className="input"
            {...register("type_id", { valueAsNumber: true })}
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid col-span-1 gap-2 row-start-2">
          <label htmlFor="">Danh mục</label>
          <select
            className="input"
            {...register("category_id", {
              valueAsNumber: true,
            })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid col-span-1 gap-2">
          <label htmlFor="">Giảm giá</label>
          <input
            type="text"
            className="input"
            {...register("discount", { required: true })}
          />
        </div>
        <div className="grid row-start-2 col-span-1 gap-2">
          <label htmlFor="">Tình trạng</label>
          <select
            className="input"
            {...register("status", {
              setValueAs: (v) => Boolean(v),
            })}
          >
            <option value={"false"}>Ngừng bán</option>
            <option value={"true"}>Đang bán</option>
          </select>
        </div>
        <div className="grid col-span-full row-span-2 row-start-3">
          <label htmlFor="">Mô tả</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("description")}
          />
        </div>
        <div className="grid col-span-full row-span-2 row-start-5">
          <label htmlFor="">Ghi chú</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("note")}
          />
        </div>
        {/* Hình ảnh */}
        <div className="flex flex-col gap-4 items-center justify-center col-span-1 row-span-2">
          <div
            className={`w-[120px] h-[120px] rounded-lg ${
              image ? "" : "border-[1px] border-dashed border-black"
            }`}
          >
            <img
              alt=""
              src={image}
              width={100}
              height={100}
              className="w-full h-full rounded-lg"
            />
          </div>
          <span
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => document.getElementById("productImage")?.click()}
          >
            Thay đổi hình ảnh
          </span>
          <input
            className="hidden"
            type="file"
            id="productImage"
            accept=""
            multiple={false}
            {...register("image")}
            onChange={handleImageChange}
          />
        </div>
      </form>
      <div className="flex justify-end items-center gap-4 mt-3">
        <Button type="button" size="small" color="danger" onClick={close}>
          Đóng
        </Button>
        <Button
          type="submit"
          size="small"
          form="editProductForm"
          loading={loading}
        >
          Lưu
        </Button>
      </div>
    </Fragment>
  );
};

export default FormEditProduct;
