import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { Material } from "../../../utils/types/type";
import { useState } from "react";
import { formatDate } from "../../../utils/dateFormat";
import Modal, { ModalTitle } from "../../ui/Modal";
import FormEditMaterial from "../forms/FormEditMaterial";

interface Props {
  materials: Material[];
  fetchMaterial: () => void
}

const MaterialTable = ({ materials, fetchMaterial }: Props) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [openEditMaterial, setOpenEditMaterial] = useState<boolean>(false);
  return (
    <Fragment>
      <Table height={500}>
        <TableHead sticky>
          <TableRow>
            <TableCell>Tên nguyên liệu</TableCell>
            <TableCell>Số lượng tồn kho</TableCell>
            <TableCell>Lần nhập gần nhất</TableCell>
            <TableCell>Lần sử dụng gần nhất</TableCell>
            <TableCell>Hạn sử dụng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <span
                    onClick={() => {
                      setSelectedMaterial(item);
                      setOpenEditMaterial(true);
                    }}
                    className="text-blue-500 hover:cursor-pointer hover:underline"
                  >
                    {item.name}
                  </span>
                </TableCell>
                <TableCell>{`${item.stock_quantity} (${
                  item.unit.short ? item.unit.short : item.unit.name
                })`}</TableCell>
                <TableCell>
                  {item.latest_import_date
                    ? formatDate(item.latest_import_date)
                    : "Không"}
                </TableCell>
                <TableCell>
                  {item.latest_export_date
                    ? formatDate(item.latest_export_date)
                    : "Không"}
                </TableCell>
                <TableCell>
                  {item.expiration_date
                    ? formatDate(item.expiration_date)
                    : "Không"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedMaterial && (
        <Modal open={openEditMaterial}>
          <ModalTitle>Thông tin nguyên liệu</ModalTitle>
          <FormEditMaterial
            reFetch={fetchMaterial}
            closeModal={() => setOpenEditMaterial(false)}
            material={selectedMaterial}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default MaterialTable;
