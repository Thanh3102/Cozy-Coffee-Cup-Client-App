import { useRef, useState, Dispatch, SetStateAction } from "react";
import { ProductType } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props {
  setTypes: Dispatch<SetStateAction<ProductType[]>>;
}

const FormSearchProductType = ({ setTypes }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputRef.current !== null) {
      setIsLoading(true);
      const productApi = new ProductApi();
      const types = await productApi.searchType(searchInputRef.current.value);
      setIsLoading(false);
      setTypes(types);
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

export default FormSearchProductType;
