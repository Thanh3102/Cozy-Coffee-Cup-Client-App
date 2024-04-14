import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import axiosClient from "../../../lib/axios";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";

interface Props extends BaseProps {
  reFetch: () => void;
  closeModal: () => void;
}

type Inputs = {
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  unit_id: number;
};

type Unit = { name: string; short: string; id: number };

const FormAddMaterial = ({ reFetch, closeModal }: Props) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setFormLoading(true);
    const { status } = await axiosClient.post<Inputs, any>(
      "/api/material/addMaterial",
      data
    );
    setFormLoading(false);
    if (status === 200) {
      toast.success("Đã thêm thành công");
      reset();
      reFetch();
      closeModal();
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
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Tên nguyên liệu</label>
          <input
            className="input"
            type="text"
            id="name"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="expiration_date">Ngày hết hạn</label>
          <input
            className="input"
            type="date"
            id="expiration_date"
            {...register("expiration_date", { valueAsDate: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
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
        <div className="flex flex-col gap-1">
          <label htmlFor="unit_id">Đơn vị tính</label>
          <select
            className="input"
            id="unit_id"
            {...register("unit_id", { required: true, valueAsNumber: true })}
          >
            <option value="" hidden>
              Chọn đơn vị
            </option>
            {units.map((unit) => {
              return (
                <option key={unit.id} value={unit.id}>
                  {`${unit.name}${unit.short ? `(${unit.short})` : ""}`}
                </option>
              );
            })}
          </select>
        </div>
      </form>
      <div className="flex justify-center gap-4 mt-5">
        <Button
          type="reset"
          size="small"
          form="addMaterialForm"
          color="warning"
        >
          Reset
        </Button>
        <Button type="submit" size="small" form="addMaterialForm">
          Thêm
        </Button>
      </div>
    </Fragment>
  );
};

export default FormAddMaterial;
