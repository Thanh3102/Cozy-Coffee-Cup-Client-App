import { motion } from "framer-motion";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import Button from "../../ui/Button";
import { Fragment, useEffect, useState } from "react";
import { HistoryListItem } from "../../../utils/types/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faRotate,
  faSearch,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../utils/dateFormat";
import Modal, { ModalTitle } from "../../ui/Modal";
import HistoryDetail from "../HistoryDetail";
import { toast } from "react-toastify";
import MaterialApi from "../../../api/Material";
import FormFilterExportImportNote from "../forms/FormFilterExportImportNote";

const TabImportExportHistory = () => {
  const [historyList, setHistoryList] = useState<HistoryListItem[]>([]);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selected, setSelected] = useState<HistoryListItem | null>(null);
  const fetchHistoryList = async () => {
    const materialApi = new MaterialApi();
    const data = await materialApi.getAllUnVoidNote();
    setHistoryList(data);
  };

  const deleteRequest = async (id: number, type: "Import" | "Export") => {
    const materialApi = new MaterialApi();
    const message = await materialApi.deleteNote(type, id);
    if (message !== null) {
      toast.success(message ?? "Đã xóa thành công");
    }
    fetchHistoryList();
  };

  useEffect(() => {
    fetchHistoryList();
  }, []);

  return (
    <Fragment>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <FormFilterExportImportNote setHistoryList={setHistoryList} />
        <div className="mt-4 px-3 py-3 bg-white rounded-lg">
          <Table height={400}>
            <TableHead>
              <TableRow>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Loại phiếu</TableCell>
                <TableCell align="center">Tác vụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell align="center">
                    <div className="flex gap-4 justify-center">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="hover:text-blue-600 hover:cursor-pointer"
                        onClick={() => {
                          setOpenDetail(true);
                          setSelected(item);
                        }}
                      />
                      <FontAwesomeIcon
                        onClick={() => {
                          deleteRequest(
                            item.id,
                            item.type === "Nhập kho" ? "Import" : "Export"
                          );
                        }}
                        icon={faTrash}
                        className="hover:text-red-600 hover:cursor-pointer"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
      <Modal open={openDetail}>
        <ModalTitle>Thông tin chi tiết</ModalTitle>
        {selected && <HistoryDetail data={selected} close={() => setOpenDetail(false)}/>}
      </Modal>
    </Fragment>
  );
};

export default TabImportExportHistory;
