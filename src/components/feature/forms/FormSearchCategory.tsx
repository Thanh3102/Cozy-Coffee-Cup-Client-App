import { useRef, useState } from "react";
import ProductApi from "../../../api/Product";
import { Category } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props {
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const FormSearchCategory = ({ setCategories }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputRef.current !== null) {
      setIsLoading(true);
      const productApi = new ProductApi();
      const categories = await productApi.searchCategory(
        searchInputRef.current.value
      );
      setIsLoading(false);
      setCategories(categories);
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

export default FormSearchCategory;
