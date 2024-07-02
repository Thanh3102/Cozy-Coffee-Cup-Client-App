import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ImportItem, Material, Provider } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import MaterialApi from "../../../api/Material";

interface Props extends BaseProps {
  setImportItems: Dispatch<SetStateAction<ImportItem[]>>;
  closeModal: () => void;
}

type ImportItemInput = {
  material_id: number;
  price: number;
  quantity: number;
};

const fetchData = async (
  setMaterial: React.Dispatch<React.SetStateAction<Material[]>>
) => {
  const materialApi = new MaterialApi();
  const materials = await materialApi.getAllActive();
  setMaterial(materials);
};

const FormAddImportItem = ({ setImportItems, closeModal }: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<
    Material | undefined | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportItemInput>();

  const onSubmit: SubmitHandler<ImportItemInput> = async (data) => {
    setImportItems((prev) => {
      const newItem: ImportItem = {
        material: materials.find(
          (material) => material.id === data.material_id
        ),
        price: data.price,
        quantity: data.quantity,
      };

      return [newItem, ...prev];
    });
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
            return <option value={material.id}>{material.name}</option>;
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
      <div className="flex flex-col gap-2 my-2">
        <label htmlFor="price">Giá tiền</label>
        <input
          className="input"
          id="price"
          {...register("price", { required: true, valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          color="danger"
          size="small"
          type="button"
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

export default FormAddImportItem;
