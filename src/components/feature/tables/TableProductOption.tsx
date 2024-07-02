import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { ProductOption } from "../../../utils/types/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditProductOption from "../forms/FormEditProductOption";
import Button from "../../ui/Button";

interface Props {
  options: ProductOption[];
  fetchOptions: () => void;
}

const ProductOptionTable = ({ options, fetchOptions }: Props) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Fragment>
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
      {selectedOption && (
        <Modal open={openEdit}>
          <ModalTitle>Chỉnh sửa tùy chọn</ModalTitle>
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

export default ProductOptionTable;
