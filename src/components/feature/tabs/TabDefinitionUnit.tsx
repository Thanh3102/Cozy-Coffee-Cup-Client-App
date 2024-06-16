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
import { Unit } from "../../../utils/types/type";
import { toast } from "react-toastify";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormAddUnit from "../forms/FormAddUnit";
import FormEditUnit from "../forms/FormEditUnit";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

const TabCustomUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>();
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
        const response = await axiosClient.get<void, { data: Unit[] }>(
          `/api/material/getUnits?q=${searchInputRef.current.value}`
        );
        setIsLoading(false);
        setUnits(response.data);
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message ?? "Đã xảy ra lỗi");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedUnit) {
        const { message } = await axiosClient.delete<void, { message: string }>(
          `/api/material/deleteUnit?id=${selectedUnit.id}`
        );
        toast.success(message);
        setOpenDelete(false);
        fetchUnit();
      } else {
        toast.error("Chưa chọn đơn vị cần xóa");
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      setOpenDelete(false);
    }
  };

  const fetchUnit = async () => {
    try {
      const response = await axiosClient.get<void, { data: Unit[] }>(
        "/api/material/getUnits"
      );
      setUnits(response.data);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchUnit();
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
            Danh sách đơn vị tính
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
                <TableCell>Mã đơn vị</TableCell>
                <TableCell>Tên đơn vị</TableCell>
                <TableCell>Tên viết tắt</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.short ?? ""}</TableCell>
                  <TableCell align="center">
                    <div className="flex gap-4 items-center justify-center">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="hover:text-blue-500 hover:cursor-pointer"
                        onClick={() => {
                          setSelectedUnit(unit);
                          setOpenEdit(true);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="hover:text-red-500 hover:cursor-pointer"
                        onClick={() => {
                          setSelectedUnit(unit);
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
        <ModalTitle>Thêm đơn vị đo</ModalTitle>
        <FormAddUnit
          closeModal={() => setOpenAdd(false)}
          fetchUnit={fetchUnit}
        />
      </Modal>
      {selectedUnit && (
        <Modal open={openEdit}>
          <ModalTitle>Chỉnh sửa đơn vị đo</ModalTitle>
          <FormEditUnit
            unit={selectedUnit}
            closeModal={() => setOpenEdit(false)}
            fetchUnit={fetchUnit}
          />
        </Modal>
      )}
      {selectedUnit && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận xóa ?</ModalTitle>
          <ModalDescription>
            Bạn có chắc muốn xóa đơn vị đo<br></br>Hành động này sẽ không thể
            hoàn tác
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

export default TabCustomUnit;
