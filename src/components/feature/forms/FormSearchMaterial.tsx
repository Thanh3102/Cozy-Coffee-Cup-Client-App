import { Dispatch, SetStateAction, useRef } from "react";
import axiosClient from "../../../lib/axios";
import { Material } from "../../../utils/types/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import MaterialApi from "../../../api/Material";

interface Props {
  setMaterials: Dispatch<SetStateAction<Material[]>>;
}

const FormSearchMaterial = ({ setMaterials }: Props) => {
  const previousController = useRef<AbortController>();

  const handleSearchMaterial = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (previousController.current) {
      previousController.current.abort();
    }
    const materialApi = new MaterialApi();
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;
    const materials = await materialApi.searchMaterial(e.target.value, signal);
    setMaterials(materials);
  };
  return (
    <form className="flex py-2 pl-2 items-center border-r-[1px] border-solid">
      <FontAwesomeIcon icon={faSearch} className="text-[#9CA3B7]" />
      <input
        className="input border-none w-[400px]"
        type="text"
        placeholder="Nhập từ khóa tìm kiếm"
        onChange={handleSearchMaterial}
      />
    </form>
  );
};

export default FormSearchMaterial;
