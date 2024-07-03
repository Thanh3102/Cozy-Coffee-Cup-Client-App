import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import axiosClient from "../../../lib/axios";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";
import { Material } from "../../../utils/types/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faX } from "@fortawesome/free-solid-svg-icons";
import { UpdateMaterialDto } from "../../../utils/types/dto";
import MaterialApi from "../../../api/Material";
import { z } from "zod";
import ErrorMessage from "../../ui/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props extends BaseProps {
  reFetch: () => void;
  closeModal: () => void;
  material: Material;
}

const materialSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  stock_quantity: z
    .number({
      invalid_type_error: "Giá trị phải là số",
      required_error: "Chưa nhập giá trị",
    })
    .min(1, { message: "Giá trị phải là số nguyên dương" })
    .max(100000, { message: "Giá trị quá lớn" }),
  expiration_date: z.coerce.date(),
  min_stock: z
    .number({
      invalid_type_error: "Chưa chọn giá trị",
      required_error: "Chưa chọn giá trị",
    })
    .min(0, { message: "Giá trị nhỏ nhất là 0" })
    .max(100000, { message: "Giá trị quá lớn" }),
  unit_id: z.number({
    invalid_type_error: "Chưa chọn giá trị",
    required_error: "Chưa chọn giá trị",
  }),
  active: z.boolean(),
});

type Inputs = z.infer<typeof materialSchema>;

type Unit = { name: string; short: string; id: number };

const FormEditMaterial = ({ reFetch, closeModal, material }: Props) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      id: material.id,
      name: material.name,
      unit_id: material.unit.id,
      stock_quantity: material.stock_quantity,
      min_stock: material.min_stock,
      active: material.active,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setFormLoading(true);
      const dto: UpdateMaterialDto = {
        ...data,
      };
      const materialApi = new MaterialApi();
      const message = await materialApi.updateMaterial(dto);
      setFormLoading(false);
      if (message !== null) {
        message && toast.success(message ?? "Cập nhật thành công");
      }
      reFetch();
      closeModal();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const fetchUnits = async () => {
    const materialApi = new MaterialApi();
    const units = await materialApi.fetchUnit();
    setUnits(units);
  };

  useEffect(() => {
    fetchUnits();
  }, []);
  return (
    <Fragment>
      <form
        id="addMaterialForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[25vw] min-w-[300px]"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Tên nguyên liệu</label>
          <input
            className="input"
            type="text"
            id="name"
            {...register("name", { required: true })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="expiration_date">Ngày hết hạn</label>
          <input
            defaultValue={
              material.expiration_date
                ? material.expiration_date.toString().split("T")[0]
                : ""
            }
            className="input"
            type="date"
            id="expiration_date"
            {...register("expiration_date", { valueAsDate: true })}
          />
          {errors.expiration_date && (
            <ErrorMessage>{errors.expiration_date.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="stock_quantity">Số lượng</label>
          <input
            className="input"
            type="text"
            id="stock_quantity"
            {...register("stock_quantity", {
              valueAsNumber: true,
            })}
          />
          {errors.stock_quantity && (
            <ErrorMessage>{errors.stock_quantity.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="unit_id">Đơn vị tính</label>
          <select
            className="input"
            id="unit_id"
            defaultValue={material.unit.id}
            {...register("unit_id", { required: true, valueAsNumber: true })}
          >
            {units.map((unit) => {
              return (
                <option key={unit.id} value={unit.id}>
                  {`${unit.name}${unit.short ? `(${unit.short})` : ""}`}
                </option>
              );
            })}
          </select>
          {errors.unit_id && (
            <ErrorMessage>{errors.unit_id.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="min_stock">Số lượng tối thiểu</label>
          <input
            className="input"
            type="text"
            id="min_stock"
            {...register("min_stock", {
              valueAsNumber: true,
            })}
          />
          {errors.min_stock && (
            <ErrorMessage>{errors.min_stock.message}</ErrorMessage>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            className="w-5 h-5"
            {...register("active")}
          />
          <span>Còn sử dụng</span>
        </div>
      </form>
      <div className="flex justify-center gap-4 mt-5">
        <Button
          type="button"
          size="small"
          color="danger"
          icon={<FontAwesomeIcon icon={faX} />}
          onClick={() => closeModal()}
        >
          Đóng
        </Button>
        <Button
          type="submit"
          size="small"
          color="success"
          form="addMaterialForm"
          icon={<FontAwesomeIcon icon={faFloppyDisk} />}
        >
          Lưu
        </Button>
      </div>
    </Fragment>
  );
};

export default FormEditMaterial;
