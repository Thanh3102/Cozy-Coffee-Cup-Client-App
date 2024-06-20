import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { Fragment, useEffect, useState } from "react";
import { BaseProps } from "../../../utils/types/interface";
import axiosClient from "../../../lib/axios";
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
    <Fragment>
      <form
        className="min-w-[30vw] grid grid-rows-6 grid-cols-3 mt-2 gap-x-4 gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
        id="addProductForm"
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
        <div className="grid col-span-1 gap-2 row-start-2">
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
        <div className="grid col-span-3 row-span-2 row-start-3">
          <label htmlFor="">Mô tả</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("description")}
          />
        </div>
        <div className="grid col-span-3 row-span-2 row-start-5">
          <label htmlFor="">Ghi chú</label>
          <textarea
            cols={10}
            rows={4}
            className="input resize-none"
            {...register("note")}
          />
        </div>
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
    </Fragment>
  );
};

export default FormAddProduct;
