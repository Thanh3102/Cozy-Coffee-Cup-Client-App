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

interface Props extends BaseProps {
  reFetch: () => void;
  closeModal: () => void;
  material: Material;
}

type Inputs = {
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  unit_id: number;
  min_stock: number;
  active: boolean;
};

type Unit = { name: string; short: string; id: number };

const FormEditMaterial = ({ reFetch, closeModal, material }: Props) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: material.name,
      unit_id: material.unit.id,
      stock_quantity: material.stock_quantity,
      min_stock: material.min_stock,
      active: material.active,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setFormLoading(true);
    try {
      console.log(data);

      const { status } = await axiosClient.post<any, any>(
        "/api/material/updateMaterial",
        {
          id: material.id,
          ...data,
        }
      );
      setFormLoading(false);
      if (status === 200) {
        toast.success("Cập nhật thành công");
        reset();
        reFetch();
        closeModal();
      }
    } catch (error: any) {
      toast.error(
        `${error.message ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại"}`
      );
    }
  };

  const fetchUnits = async () => {
    const { data } = await axiosClient.get("/api/material/getUnits");
    setUnits(data);
  };

  useEffect(() => {
    fetchUnits();
  }, []);
  return (
    <Fragment>
      <form
        id="addMaterialForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 min-w-[25vw]"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Tên nguyên liệu</label>
          <input
            className="input"
            type="text"
            id="name"
            {...register("name", { required: true })}
          />
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
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="stock_quantity">Số lượng</label>
          <input
            className="input"
            type="text"
            id="stock_quantity"
            {...register("stock_quantity", {
              required: true,
              min: 0,
              max: 10000,
              valueAsNumber: true,
            })}
          />
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
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="min_stock">Số lượng tối thiểu</label>
          <input
            className="input"
            type="text"
            id="min_stock"
            {...register("min_stock", {
              required: true,
              min: 0,
              valueAsNumber: true,
            })}
          />
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
          form="addMaterialForm"
          icon={<FontAwesomeIcon icon={faFloppyDisk} />}
        >
          Cập nhật
        </Button>
      </div>
    </Fragment>
  );
};

export default FormEditMaterial;
