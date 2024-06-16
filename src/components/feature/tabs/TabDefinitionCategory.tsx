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
import { faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../lib/axios";
import { Category } from "../../../utils/types/type";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import FormAddCategory from "../forms/FormAddCategory";
import FormEditCategory from "../forms/FormEditCategory";

const TabCustomCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputRef.current !== null) {
      setIsLoading(true);
      try {
        const { categories } = await axiosClient.get<
          void,
          { categories: Category[] }
        >(`/api/product/getCategory?q=${searchInputRef.current.value}`);
        setIsLoading(false);
        setCategories(categories);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message ?? "Đã xảy ra lỗi");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        const { message } = await axiosClient.delete<void, { message: string }>(
          `/api/product/deleteCategory?id=${selectedCategory.id}`
        );
        toast.success(message);
        setOpenDelete(false);
        fetchCategories();
      } else {
        toast.error("Chưa chọn danh mục cần xóa");
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      setOpenDelete(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { categories } = await axiosClient.get<
        void,
        { categories: Category[] }
      >("/api/product/getCategory");
      setCategories(categories);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
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
        </div>
      </motion.div>
      <Modal open={openAdd}>
        <ModalTitle>Thêm danh mục</ModalTitle>
        <FormAddCategory
          close={() => setOpenAdd(false)}
          fetchCategories={fetchCategories}
        />
      </Modal>
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
            Bạn có chắc chắn muốn xóa danh mục ?
            <br/>
            Hành động này sẽ không thể hoàn tác
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

export default TabCustomCategory;
