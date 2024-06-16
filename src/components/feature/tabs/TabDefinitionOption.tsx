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
import { ProductOption } from "../../../utils/types/type";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import FormAddProductOption from "../forms/FormAddProductOption";
import FormEditProductOption from "../forms/FormEditProductOption";

const TabDefinitionOption = () => {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ProductOption>();
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
        const { options } = await axiosClient.get<
          void,
          { options: ProductOption[] }
        >(`/api/product/getOption?q=${searchInputRef.current.value}`);
        setIsLoading(false);
        setOptions(options);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message ?? "Đã xảy ra lỗi");
      }
    }
  };

  const fetchOptions = async () => {
    try {
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >("/api/product/getOption");
      setOptions(options);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchOptions();
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
            Danh sách tùy chọn
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
                <TableCell>Mã tuỳ chọn</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.id}</TableCell>
                  <TableCell>{option.title}</TableCell>
                  <TableCell align="center">
                    <div className="flex gap-4 items-center justify-center">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="hover:text-blue-500 hover:cursor-pointer"
                        onClick={() => {
                          setSelectedOption(option);
                          setOpenEdit(true);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="hover:text-red-500 hover:cursor-pointer"
                        onClick={() => {
                          toast.info("Chưa hoàn thiện");
                          // setSelectedOption(option);
                          // setOpenDelete(true);
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
        <ModalTitle>Thêm tùy chọn mới</ModalTitle>
        <FormAddProductOption
          fetchOptions={fetchOptions}
          closeModal={() => setOpenAdd(false)}
        />
      </Modal>
      {selectedOption && (
        <Modal open={openEdit}>
          <ModalTitle>Chỉnh sửa danh mục</ModalTitle>
          <FormEditProductOption
            id={selectedOption.id}
            closeModal={() => setOpenEdit(false)}
            fetchOptions={fetchOptions}
          />
        </Modal>
      )}
      {selectedOption && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận xóa ?</ModalTitle>
          <ModalDescription>
            Bạn có chắc chắn muốn xóa tùy chọn này ?<br></br>Hành động này không
            thể hoàn tác
          </ModalDescription>
          <div className="flex gap-4 justify-end mt-2">
            <Button size="small" onClick={() => setOpenDelete(false)}>
              Hủy
            </Button>
            <Button size="small" color="danger">
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default TabDefinitionOption;
