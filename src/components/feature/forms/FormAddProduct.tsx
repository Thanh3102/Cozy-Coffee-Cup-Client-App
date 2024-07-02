import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { Fragment, useEffect, useState } from "react";
import { BaseProps } from "../../../utils/types/interface";
import { toast } from "react-toastify";
import { Category, ProductType } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

interface Props extends BaseProps {
  fetchProduct: () => void;
  closeModal: () => void;
}

interface Inputs {
  name: string;
  price: number;
  type_id: number;
  category_id: number;
  description: string;
  note: string;
  image: File;
}

const FormAddProduct = ({ closeModal, fetchProduct }: Props) => {
  const [image, setImage] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    const productApi = new ProductApi();
    const categories = await productApi.getAllCategory();
    setCategories(categories);
  };

  const fetchTypes = async () => {
    const productApi = new ProductApi();
    const types = await productApi.getAllType();
    setTypes(types);
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const { register, handleSubmit, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const productApi = new ProductApi();
    const message = await productApi.createProduct(data);
    setLoading(false);
    toast.success(message ?? "Thêm thành công");
    fetchProduct();
    closeModal();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      setImage(URL.createObjectURL(e.target.files[0]));
      setValue("image", e.target.files[0]);
    } catch (error) {}
  };

  return (
    <div className="w-[50vw] h-[550px] min-w-[500px] overflow-y-auto">
      <form
        className=" grid grid-cols-2 grid-rows-8 gap-x-2 md:grid-cols-3 md:grid-rows-6"
        onSubmit={handleSubmit(onSubmit)}
        id="addProductForm"
      >
        <div className="flex flex-col gap-2 col-start-1 row-start-1">
          <label htmlFor="">Tên sản phẩm</label>
          <input
            type="text"
            className="input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-2 col-start-1 row-start-2 md:col-start-2 md:row-start-1">
          <label htmlFor="">Giá tiền</label>
          <input
            type="text"
            className="input"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-2 col-start-1 row-start-3 md:col-start-1 md:row-start-2">
          <label htmlFor="">Loại sản phẩm</label>
          <select
            className="input"
            {...register("type_id", { valueAsNumber: true })}
          >
            <option value="" hidden>
              Chọn loại sản phẩm
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 col-start-1 row-start-4 md:col-start-2 md:row-start-2">
          <label htmlFor="">Danh mục</label>
          <select
            className="input"
            {...register("category_id", {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option value="" hidden>
              Chọn danh mục
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 col-start-1 row-start-5 col-span-2 row-span-2 md:col-start-1 md:row-start-3 md:row-span-2 md:col-span-full">
          <label htmlFor="">Mô tả</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("description")}
          />
        </div>
        <div className="flex flex-col gap-2 col-start-1 row-start-7 col-span-2 row-span-2 md:col-start-1 md:row-start-5 md:row-span-3 md:col-span-full">
          <label htmlFor="">Ghi chú</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("note")}
          />
        </div>
        <div className="flex flex-col gap-4 items-center justify-center col-start-2 col-span-1 row-span-4 md:col-start-3 md:row-start-1 md:row-span-2">
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
            Chọn hình ảnh
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
      <div className="flex gap-4 mt-4 justify-end">
        <Button
          size="small"
          color="danger"
          onClick={closeModal}
          icon={<FontAwesomeIcon icon={faX} />}
        >
          Đóng
        </Button>
        <Button
          size="small"
          color="success"
          form="addProductForm"
          type="submit"
          loading={loading}
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default FormAddProduct;
