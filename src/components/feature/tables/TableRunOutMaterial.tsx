import { useEffect, useState } from "react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";

type RunOutMaterial = {
  id: number;
  name: string;
  stock_quantity: number;
  unit: string;
};

const RunOutMaterialTable = () => {
  const [runOutMaterials, setRunOutMaterials] = useState<RunOutMaterial[]>([]);

  const fetchRunOutMaterials = async () => {
    try {
      const { materials } = await axiosClient<
        void,
        { materials: RunOutMaterial[] }
      >("/api/material/getRunOutMaterial");
      setRunOutMaterials(materials);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu nguyên liệu sắp hết");
      return;
    }
  };

  useEffect(() => {
    fetchRunOutMaterials();
  }, []);

  return (
    <Table>
      <TableHead sticky>
        <TableRow>
          <TableCell>Mã nguyên liệu</TableCell>
          <TableCell>Tên nguyên liệu</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Đơn vị tính</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {runOutMaterials.map((material) => (
          <TableRow key={material.id}>
            <TableCell>{material.id}</TableCell>
            <TableCell>{material.name}</TableCell>
            <TableCell>{material.stock_quantity}</TableCell>
            <TableCell>{material.unit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RunOutMaterialTable;
