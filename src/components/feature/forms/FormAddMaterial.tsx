import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import axiosClient from "../../../lib/axios";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRotateRight, faX } from "@fortawesome/free-solid-svg-icons";
import MaterialApi from "../../../api/Material";

interface Props extends BaseProps {
  reFetch: () => void;
  closeModal: () => void;
}

type Inputs = {
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  min_stock: number;
  unit_id: number;
};

type Unit = { name: string; short: string; id: number };

const FormAddMaterial = ({ reFetch, closeModal }: Props) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      min_stock: 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const materialApi = new MaterialApi();
    setFormLoading(true);
    const message = await materialApi.createMaterial(data);
    setFormLoading(false);
    message && toast.success(message);
    reFetch();
    closeModal();
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
        className="flex flex-col gap-5 w-[25vw]"
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
            min={new Date().toISOString().split("T")[0]}
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
        <div className="flex flex-col gap-1">
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
      </form>
      <div className="flex justify-center gap-4 mt-5">
        <Button
          size="small"
          color="danger"
          icon={<FontAwesomeIcon icon={faX} />}
          onClick={closeModal}
          className={`${formLoading ? "hidden" : ""}`}
        >
          Đóng
        </Button>
        <Button
          type="reset"
          size="small"
          color="warning"
          form="addMaterialForm"
          icon={<FontAwesomeIcon icon={faRotateRight} />}
          className={`${formLoading ? "hidden" : ""}`}
        >
          Reset
        </Button>
        <Button
          type="submit"
          size="small"
          form="addMaterialForm"
          color="success"
          icon={<FontAwesomeIcon icon={faPlus} />}
          loading={formLoading}
        >
          Thêm
        </Button>
      </div>
    </Fragment>
  );
};

export default FormAddMaterial;
