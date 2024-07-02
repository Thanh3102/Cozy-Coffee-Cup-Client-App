import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Category } from "../../../utils/types/type";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useState } from "react";
import ProductApi from "../../../api/Product";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditCategory from "../forms/FormEditCategory";
import Button from "../../ui/Button";

interface Props {
  categories: Category[];
  fetchCategories: () => void;
}

const CategoryTable = ({ categories, fetchCategories }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    if (selectedCategory) {
      const productApi = new ProductApi();
      const message = await productApi.deleteCategory(selectedCategory.id);
      message && toast.success(message);
      setOpenDelete(false);
      fetchCategories();
    } else {
      toast.error("Chưa chọn danh mục cần xóa");
    }
  };
  return (
    <Fragment>
      <Table height={400}>
        <TableHead sticky>
          <TableRow>
            <TableCell>Mã danh mục</TableCell>
            <TableCell>Tên danh mục</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell align="center">
                <div className="flex gap-4 items-center justify-center">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="hover:text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category);
                      setOpenEdit(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="hover:text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category);
                      setOpenDelete(true);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedCategory && (
        <Modal open={openEdit}>
          <ModalTitle>Chỉnh sửa danh mục</ModalTitle>
          <FormEditCategory
            category={selectedCategory}
            close={() => setOpenEdit(false)}
            fetchCategories={fetchCategories}
          />
        </Modal>
      )}
      {selectedCategory && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận xóa ?</ModalTitle>
          <ModalDescription>
            Bạn có chắc chắn muốn xóa danh mục ? (Không thể hoàn tác)
          </ModalDescription>
          <div className="flex gap-4 justify-end mt-2">
            <Button size="small" onClick={() => setOpenDelete(false)}>
              Hủy
            </Button>
            <Button size="small" color="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default CategoryTable;
