import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Unit } from "../../../utils/types/type";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useState } from "react";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditUnit from "../forms/FormEditUnit";
import Button from "../../ui/Button";
import MaterialApi from "../../../api/Material";

interface Props {
  units: Unit[];
  fetchUnit: () => void;
}

const UnitDefinitionTable = ({ units, fetchUnit }: Props) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    const materialApi = new MaterialApi();
    try {
      if (selectedUnit) {
        materialApi.deleteUnit(selectedUnit.id);
        setOpenDelete(false);
        fetchUnit();
      }
    } catch (error: any) {
      setOpenDelete(false);
    }
  };

  return (
    <Fragment>
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

export default UnitDefinitionTable;
