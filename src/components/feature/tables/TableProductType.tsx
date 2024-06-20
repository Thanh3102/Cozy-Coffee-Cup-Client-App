import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { ProductType } from "../../../utils/types/type";
import { useState } from "react";
import ProductApi from "../../../api/Product";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditProductType from "../forms/FormEditProductType";
import Button from "../../ui/Button";

interface Props {
  types: ProductType[];
  fetchProductType: () => void;
}

const ProductTypeTable = ({ types, fetchProductType }: Props) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<ProductType>();

  const handleDelete = async () => {
    try {
      if (selectedType) {
        const productApi = new ProductApi();
        const message = await productApi.deleteType(selectedType.id);
        message && toast.success(message);
        setOpenDelete(false);
        fetchProductType();
      } else {
        toast.error("Chưa chọn danh mục cần xóa");
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      setOpenDelete(false);
    }
  };
  return (
    <Fragment>
      <Table height={400}>
        <TableHead sticky>
          <TableRow>
            <TableCell>Mã loại</TableCell>
            <TableCell>Tên loại</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {types.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.id}</TableCell>
              <TableCell>{type.name}</TableCell>
              <TableCell align="center">
                <div className="flex gap-4 items-center justify-center">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="hover:text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      setSelectedType(type);
                      setOpenEdit(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="hover:text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      setSelectedType(type);
                      setOpenDelete(true);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedType && (
        <Modal open={openEdit}>
          <ModalTitle>Chỉnh sửa loại sản phẩm</ModalTitle>
          <FormEditProductType
            type={selectedType}
            close={() => setOpenEdit(false)}
            fetchType={fetchProductType}
          />
        </Modal>
      )}
      {selectedType && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận xóa ?</ModalTitle>
          <ModalDescription>
            Bạn có chắc chắn muốn xóa loại sản phẩm ?
            <br />
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

export default ProductTypeTable;
