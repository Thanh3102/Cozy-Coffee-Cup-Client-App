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
import axiosClient from "../../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { formatDate } from "../../../utils/dateFormat";
import Modal, { ModalTitle } from "../../ui/Modal";
import HistoryDetail from "../HistoryDetail";
import { toast } from "react-toastify";

type Inputs = {
  type: string;
  start: string;
  end: string;
  name: string;
};

const TabImportExportHistory = () => {
  const [historyList, setHistoryList] = useState<HistoryListItem[]>([]);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selected, setSelected] = useState<HistoryListItem | null>(null);
  const fetchHistoryList = async () => {
    const { data } = await axiosClient.get<void, { data: HistoryListItem[] }>(
      "/api/import-export/getByFilter"
    );
    setHistoryList(data);
  };

  const { register, reset, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { data } = await axiosClient.get<void, { data: HistoryListItem[] }>(
      `/api/import-export/getByFilter?type=${formData.type}&start=${formData.start}&end=${formData.end}&name=${formData.name}`
    );
    setHistoryList(data);
  };

  const deleteRequest = async (id: number, type: "Import" | "Export") => {
    try {
      const response = await axiosClient.post<
        void,
        { status: number; message: string }
      >(`/api/import-export/delete${type}Note?id=${id}`);
      if (response.status === 200) {
        toast.success(response.message);
        fetchHistoryList();
      }
    } catch (error: any) {
      toast.error(error.message ? error.message : "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchHistoryList();
  }, []);

  return (
    <Fragment>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-white rounded-lg px-3 py-3">
          <form
            className="flex gap-8"
            onSubmit={handleSubmit(onSubmit)}
            id="historyNoteFilter"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="startDate">Ngày bắt đầu</label>
              <input
                className="input"
                type="date"
                id="startDate"
                {...register("start")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="endDate">Ngày kết thúc</label>
              <input
                className="input"
                type="date"
                id="endDate"
                {...register("end")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Người tạo</label>
              <input
                className="input"
                type="text"
                id=""
                {...register("name")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Loại phiếu</label>
              <select className="input" {...register("type")}>
                <option value="">Tất cả</option>
                <option value="import">Nhập kho</option>
                <option value="export">Xuất kho</option>
              </select>
            </div>
          </form>
          <div className="mt-4 flex gap-4">
            <Button size="small" type="submit" form="historyNoteFilter">
              Tìm kiếm
            </Button>
            <Button
              size="small"
              type="button"
              color="warning"
              onClick={() => {
                reset();
                fetchHistoryList();
              }}
            >
              Làm mới
            </Button>
          </div>
        </div>
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
          <div
            className="flex justify-between items-center py-1"
            onClick={() => {
              setOpenDetail(false);
            }}
          >
            <ModalTitle>Thông tin chi tiết</ModalTitle>
            <FontAwesomeIcon icon={faX} className="cursor-pointer" />
          </div>
          {selected && (
            <HistoryDetail data={selected} />
          )}
      </Modal>
    </Fragment>
  );
};

export default TabImportExportHistory;
