import { SubmitHandler, useForm } from "react-hook-form";
import { ExportItem, Material } from "../../../utils/types/type";
import { useEffect, useState } from "react";
import axiosClient from "../../../lib/axios";
import Button from "../../ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseProps } from "../../../utils/types/interface";

interface Props extends BaseProps {
  setExportItems: React.Dispatch<React.SetStateAction<ExportItem[]>>;
  closeModal: () => void;
}

type Inputs = {
  material_id: number;
  quantity: number;
};

const fetchData = async (
  setMaterial: React.Dispatch<React.SetStateAction<Material[]>>
) => {
  const fetchMaterialResponse = await axiosClient.get<
    void,
    { data: Material[] }
  >("/api/material/getAllActive");
  setMaterial(fetchMaterialResponse.data);
};

const FormAddExportItem = ({ setExportItems, closeModal }: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<
    Material | undefined | null
  >(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newItem: ExportItem = {
      material: selectedMaterial,
      quantity: data.quantity,
    };
    setExportItems((prev) => [newItem, ...prev]);
    closeModal();
  };

  useEffect(() => {
    fetchData(setMaterials);
  }, []);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 my-2">
        <label htmlFor="material_name">Tên nguyên liệu</label>
        <select
          className="input"
          id="material_name"
          {...register("material_id", { required: true, valueAsNumber: true })}
          onChange={(e) => {
            const selectMat = materials.find((material) => {
              return material.id === parseInt(e.target.value);
            });
            setSelectedMaterial(selectMat);
          }}
        >
          <option value="" hidden>
            Chọn nguyên liệu
          </option>
          {materials.map((material) => {
            return (
              <option value={material.id} key={material.id}>
                {material.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-col gap-2 my-2">
        <label htmlFor="stock_quantity">Số lượng</label>
        <input
          className="input"
          id="stock_quantity"
          {...register("quantity", { required: true, valueAsNumber: true })}
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <label htmlFor="unit">Đơn vị tính</label>
        <input
          className="input disable"
          id="unit"
          readOnly
          defaultValue={selectedMaterial ? `${selectedMaterial.unit.name}` : ""}
        />
      </div>
      <div className="flex justify-end mt-3">
        <Button color="success" size="small" type="submit">
          <FontAwesomeIcon icon={faPlus} />
          Thêm
        </Button>
      </div>
    </form>
  );
};

export default FormAddExportItem;
