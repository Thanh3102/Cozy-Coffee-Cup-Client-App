import { useRef, useState } from "react";
import MaterialApi from "../../../api/Material";
import { BaseProps } from "../../../utils/types/interface";
import { Unit } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props extends BaseProps {
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
}

const FormSearchUnit = ({ setUnits }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputRef.current !== null) {
      setIsLoading(true);
      try {
        const materialApi = new MaterialApi();
        const data = await materialApi.searchUnit(searchInputRef.current.value);
        setIsLoading(false);
        setUnits(data);
      } catch (error: any) {
        setIsLoading(false);
      }
    }
  };
  return (
    <form className="mt-2 flex gap-[20px]" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        placeholder="Nhập từ khóa cần tìm"
        ref={searchInputRef}
      />
      <Button
        loading={isLoading}
        size="small"
        type="submit"
        icon={<FontAwesomeIcon icon={faSearch} />}
      >
        Tìm kiếm
      </Button>
    </form>
  );
};

export default FormSearchUnit;
