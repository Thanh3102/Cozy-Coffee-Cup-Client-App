import { SubmitHandler, useForm } from "react-hook-form";
import { ExportItem, Material } from "../../../utils/types/type";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseProps } from "../../../utils/types/interface";
import MaterialApi from "../../../api/Material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  setExportItems: React.Dispatch<React.SetStateAction<ExportItem[]>>;
  closeModal: () => void;
}

const itemSchema = z.object({
  material_id: z.number({ invalid_type_error: "Chưa nhập giá trị" }),
  quantity: z
    .number({
      required_error: "Chưa nhập giá trị",
      invalid_type_error: "Giá trị phải là số",
    })
    .min(1, "Giá trị nhỏ nhất là 1")
    .max(10000, { message: "Giá trị lớn nhất là 10000" }),
});

type Inputs = z.infer<typeof itemSchema>;

const fetchData = async (
  setMaterial: React.Dispatch<React.SetStateAction<Material[]>>
) => {
  const materialApi = new MaterialApi();
  const materials = await materialApi.getAllActive();
  setMaterial(materials);
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
  } = useForm<Inputs>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      quantity: 1,
    },
  });

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
    <form
      className="flex flex-col min-w-[25vw]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1 my-1">
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
        {errors.material_id && (
          <ErrorMessage>{errors.material_id.message}</ErrorMessage>
        )}
      </div>
      <div className="flex flex-col gap-1 my-1">
        <label htmlFor="stock_quantity">Số lượng</label>
        <input
          className="input"
          id="stock_quantity"
          {...register("quantity", { required: true, valueAsNumber: true })}
        />
        {errors.quantity && (
          <ErrorMessage>{errors.quantity.message}</ErrorMessage>
        )}
      </div>
      <div className="flex flex-col gap-1 my-1">
        <label htmlFor="unit">Đơn vị tính</label>
        <input
          className="input disable"
          id="unit"
          readOnly
          defaultValue={selectedMaterial ? `${selectedMaterial.unit.name}` : ""}
        />
      </div>
      <div className="flex justify-end mt-3 gap-4">
        <Button
          color="danger"
          size="small"
          type="submit"
          icon={<FontAwesomeIcon icon={faX} />}
          onClick={closeModal}
        >
          Đóng
        </Button>
        <Button
          color="success"
          size="small"
          type="submit"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Thêm
        </Button>
      </div>
    </form>
  );
};

export default FormAddExportItem;
