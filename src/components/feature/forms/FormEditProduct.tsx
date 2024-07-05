import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import { Category, Product, ProductType } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ProductApi from "../../../api/Product";
import { UpdateProductDto } from "../../../utils/types/dto";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive, faX } from "@fortawesome/free-solid-svg-icons";

interface Props extends BaseProps {
  product: Product;
  fetchProduct: () => void;
  close: () => void;
}

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Chưa nhập tên sản phẩm" }),
  price: z
    .number({
      required_error: "Chưa nhập giá trị",
      invalid_type_error: "Giá trị phải là số",
    })
    .min(1000, { message: "Giá trị nhỏ nhất là 1000" })
    .max(1000000000, { message: "Giá trị quá lớn" }),
  type_id: z.number({ invalid_type_error: "Chưa chọn loại sản phẩm" }),
  category_id: z.number({ invalid_type_error: "Chưa chọn danh mục" }),
  description: z.string().max(1000, { message: "Mô tả không quá 1000 kí tự" }),
  note: z.string().max(1000, { message: "Ghi chú không quá 1000 kí tự" }),
  image: z.instanceof(File, { message: "Chưa chọn ảnh" }).nullable(),
  discount: z
    .number({
      required_error: "Chưa nhập giá trị",
      invalid_type_error: "Giá trị phải là số",
    })
    .min(0, { message: "Giá trị trong khoảng 0-100" })
    .max(100, { message: "Giá trị trong khoảng 0-100" }),
  status: z.boolean(),
});

type Inputs = z.infer<typeof productSchema>;

const FormEditProduct = ({ product, close, fetchProduct }: Props) => {
  const [image, setImage] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      type_id: product.type.id,
      category_id: product.category.id,
      status: product.status,
      note: product.note,
      description: product.description,
      image: null,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const productApi = new ProductApi();
    setLoading(true);
    const dto: UpdateProductDto = {
      ...data,
    };
    const message = await productApi.updateProduct(dto);
    setLoading(false);
    message && toast.success(message);
    fetchProduct();
    close();
  };

  const fetchCategories = async () => {
    const productApi = new ProductApi();
    const categories = await productApi.getAllCategory();
    setCategories(categories);
    setValue("category_id", product.category.id);
  };

  const fetchTypes = async () => {
    const productApi = new ProductApi();
    const types = await productApi.getAllType();
    setTypes(types);
    setValue("type_id", product.type.id);
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
        className="w-[calc(100vw-400px)] min-w-[600px]"
        onSubmit={handleSubmit(onSubmit)}
        id="editProductForm"
      >
        <div className="flex">
          <div className="flex-[2] flex flex-wrap -mx-4">
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
              <label htmlFor="">Tên sản phẩm</label>
              <input
                type="text"
                className="input"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
              <label htmlFor="">Giá tiền</label>
              <input
                type="text"
                className="input"
                {...register("price", { required: true, valueAsNumber: true })}
              />
              {errors.price && (
                <ErrorMessage>{errors.price.message}</ErrorMessage>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
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
              {errors.type_id && (
                <ErrorMessage>{errors.type_id.message}</ErrorMessage>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
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
              {errors.category_id && (
                <ErrorMessage>{errors.category_id.message}</ErrorMessage>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
              <label htmlFor="">Giảm giá</label>
              <input
                type="text"
                className="input"
                {...register("discount", { valueAsNumber: true })}
              />
              {errors.discount && (
                <ErrorMessage>{errors.discount.message}</ErrorMessage>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[50%] lg:w-[33%] px-4">
              <label htmlFor="">Tình trạng</label>
              <select
                className="input"
                {...register("status", {
                  setValueAs: (v) => Boolean(v),
                })}
              >
                <option value={""}>Ngừng bán</option>
                <option value={"true"}>Đang bán</option>
              </select>
              {errors.status && (
                <ErrorMessage>{errors.status.message}</ErrorMessage>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {/* Hình ảnh */}
            <div className="flex flex-col gap-2">
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
                className="text-blue-500 hover:cursor-pointer text-center"
                onClick={() => document.getElementById("productImage")?.click()}
              >
                Thay đổi hình ảnh
              </span>
              <input
                className="hidden"
                type="file"
                id="productImage"
                accept="image/*"
                multiple={false}
                {...register("image")}
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Mô tả</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Ghi chú</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("note")}
          />
          {errors.note && <ErrorMessage>{errors.note.message}</ErrorMessage>}
        </div>
      </form>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          type="button"
          size="small"
          color="danger"
          onClick={close}
          icon={<FontAwesomeIcon icon={faX} />}
        >
          Đóng
        </Button>
        <Button
          type="submit"
          size="small"
          form="editProductForm"
          loading={loading}
          icon={<FontAwesomeIcon icon={faFileArchive} />}
        >
          Lưu
        </Button>
      </div>
    </Fragment>
  );
};

export default FormEditProduct;
