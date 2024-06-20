import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import {
  ExportNote,
  HistoryListItem,
  ImportNote,
} from "../../utils/types/type";
import { formatDate } from "../../utils/dateFormat";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import axiosClient from "../../lib/axios";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
import { currencyFormatter } from "../../utils/currencyFormat";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface Props extends BaseProps {
  data: HistoryListItem;
  close: () => void;
}

const ImportNoteDetail = ({ data, close }: Props) => {
  const [detail, setDetail] = useState<ImportNote>();

  const countTotal = (note: ImportNote) => {
    return note.import_note_detail.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const fetchDetailData = async () => {
    const { importNote } = await axiosClient.get<
      void,
      { importNote: ImportNote }
    >(`/api/import-export/getImportNoteDetail?id=${data.id}`);
    setDetail(importNote);
  };

  const handleDownloadExcel = async (id: number) => {
    const response = await axiosClient
      .get(`/api/import-export/exportImportNoteExcel?id=${id}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const filename = response.headers["x-filename"];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchDetailData();
  }, []);
  return (
    <Fragment>
      {detail && (
        <Fragment>
          <div className="">
            <p>
              {`Thời gian tạo: ${
                detail?.created_at ? formatDate(detail?.created_at) : ""
              }`}
            </p>
            <p>{`Người tạo: ${detail?.user.name}`}</p>
            <p>{`Người nhập kho: ${detail?.receiver_name}`}</p>
            <p>{`Nhà cung cấp: ${detail?.provider.name}`}</p>
            <div className="flex justify-end my-3">
              <Button
                size="small"
                onClick={() => handleDownloadExcel(detail?.id)}
              >
                Xuất Excel
              </Button>
            </div>
          </div>
          <h4 className="font-semibold text-[18px] mb-2">
            Danh sách nguyên liệu
          </h4>
          <Table height={200}>
            <TableHead sticky>
              <TableRow>
                <TableCell>Tên nguyên liệu</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá tiền</TableCell>
                <TableCell>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail?.import_note_detail.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.material.name}</TableCell>
                    <TableCell>{`${item.quantity} (${
                      item.material.unit.short
                        ? item.material.unit.short
                        : item.material.unit.name
                    })`}</TableCell>
                    <TableCell>{`${currencyFormatter.format(
                      item.price
                    )}`}</TableCell>
                    <TableCell>
                      {`${currencyFormatter.format(
                        item.price * item.quantity
                      )}`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-between font-semibold text-[16px] my-2">
            <span>{`Thành tiền: ${
              countTotal ? currencyFormatter.format(countTotal(detail)) : ""
            }`}</span>
            <Button
              size="small"
              color="danger"
              icon={<FontAwesomeIcon icon={faX} />}
              onClick={close}
            >
              Đóng
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const ExportNoteDetail = ({ data, close }: Props) => {
  const [detail, setDetail] = useState<ExportNote>();
  const fetchDetailData = async () => {
    const { exportNote } = await axiosClient.get<
      void,
      { exportNote: ExportNote }
    >(`/api/import-export/getExportNoteDetail?id=${data.id}`);
    setDetail(exportNote);
  };

  const handleDownloadExcel = async (id: number) => {
    const response = await axiosClient
      .get(`/api/import-export/exportExportNoteExcel?id=${id}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const filename = response.headers["x-filename"];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchDetailData();
  }, []);
  return (
    <Fragment>
      {detail && (
        <Fragment>
          <div className="min-w-[30vw]">
            <p>
              {`Thời gian tạo: ${
                detail?.created_at ? formatDate(detail?.created_at) : ""
              }`}
            </p>
            <p>{`Người tạo: ${detail?.user.name}`}</p>
            <p>{`Người lấy hàng: ${detail?.picker_name}`}</p>
            <div className="flex justify-end my-3">
              <Button
                size="small"
                onClick={() => handleDownloadExcel(detail.id)}
              >
                Xuất Excel
              </Button>
            </div>
          </div>
          <h4 className="font-semibold text-[18px] mb-2">
            Danh sách nguyên liệu
          </h4>
          <Table height={200}>
            <TableHead sticky>
              <TableRow>
                <TableCell>Tên nguyên liệu</TableCell>
                <TableCell>Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail?.export_note_detail.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.material.name}</TableCell>
                    <TableCell>{`${item.quantity} (${
                      item.material.unit.short
                        ? item.material.unit.short
                        : item.material.unit.name
                    })`}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button
              size="small"
              color="danger"
              icon={<FontAwesomeIcon icon={faX} />}
              onClick={close}
            >
              Đóng
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const HistoryDetail = ({ data, close }: Props) => {
  if (data.type === "Nhập kho")
    return <ImportNoteDetail data={data} close={close} />;
  return <ExportNoteDetail data={data} close={close} />;
};

export default HistoryDetail;
