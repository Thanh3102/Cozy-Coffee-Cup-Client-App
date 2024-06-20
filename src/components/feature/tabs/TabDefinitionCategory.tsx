import { motion } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Category } from "../../../utils/types/type";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import FormAddCategory from "../forms/FormAddCategory";
import FormEditCategory from "../forms/FormEditCategory";
import ProductApi from "../../../api/Product";
import FormSearchCategory from "../forms/FormSearchCategory";
import CategoryTable from "../tables/TableCategory";

const TabCustomCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchCategories = async () => {
    const productApi = new ProductApi();
    const categories = await productApi.getAllCategory();
    setCategories(categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Fragment>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button
          color="success"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setOpenAdd(true)}
        >
          Thêm mới
        </Button>
        <div className="bg-white p-4 mt-2 rounded-md">
          <h5 className="font-semibold text-[22px] text-amber-700">
            Danh sách danh mục
          </h5>
          <FormSearchCategory setCategories={setCategories} />
          <CategoryTable
            categories={categories}
            fetchCategories={fetchCategories}
          />
        </div>
      </motion.div>
      <Modal open={openAdd}>
        <ModalTitle>Thêm danh mục</ModalTitle>
        <FormAddCategory
          close={() => setOpenAdd(false)}
          fetchCategories={fetchCategories}
        />
      </Modal>
    </Fragment>
  );
};

export default TabCustomCategory;
