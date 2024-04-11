import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../../ui/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  BaseProps,
  CreateExportNoteDto,
  CreateImportNoteDto,
} from "../../../utils/types/interface";
import FormAddExportItem from "./FormAddExportItem";
import { ExportItem } from "../../../utils/types/type";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";

interface Props extends BaseProps {
  closeModal: () => void;
  reFetchMaterial: () => void;
}

type Inputs = {
  picker_name: string;
  note: string;
};

const FormAddExportNote = ({ closeModal, reFetchMaterial }: Props) => {
  const [openAddExportItem, setOpenAddExportItem] = useState<boolean>(false);
  const [exportItems, setExportItems] = useState<ExportItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const exportList: {
      quantity: number;
      material_id: number | undefined;
    }[] = [];

    if (exportItems.length !== 0) {
      exportItems.forEach((item) =>
        exportList.push({
          quantity: item.quantity,
          material_id: item.material?.id,
        })
      );
    } else {
      toast.error("Danh sách nguyên liệu trống");
      return;
    }

    const sendData = {
      export_note_detail: exportList,
      ...data,
    };

    try {
      const response = await axiosClient.post<CreateExportNoteDto, any>(
        "/api/import-export/createExportNote",
        sendData
      );
      if (response.status === 200) {
        toast.success("Đã tạo phiếu xuất kho");
        closeModal();
        reFetchMaterial();
      }
    } catch (error: any) {
      console.log(error);

      toast.error(`${error.message}`);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="">Tên người nhập</label>
            <input
              type="text"
              className="input"
              {...register("picker_name", { required: true })}
            />
          </div>
        </div>
        <div className="flex justify-between items-center my-3">
          <h5>Danh sách nguyên liệu</h5>
          <Button
            size="small"
            type="button"
            color="success"
            onClick={() => setOpenAddExportItem(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm
          </Button>
        </div>
        <Table height={200}>
          <TableHead>
            <TableRow className="text-[12px]">
              <TableCell>Tên nguyên liệu</TableCell>
              <TableCell>Số lượng</TableCell>

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exportItems.map((item) => (
              <TableRow key={item.material?.id}>
                <TableCell>{item.material?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="hover:text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      setExportItems(
                        exportItems.filter(
                          (_item) => _item.material?.id !== item.material?.id
                        )
                      );
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="note">Ghi chú</label>
          <textarea
            id="note"
            cols={10}
            rows={5}
            className="border-[1px] border-black rounded-lg p-2 resize-none"
            {...register("note")}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="small" color="success">
            Tạo
          </Button>
        </div>
      </form>
      <Modal open={openAddExportItem}>
        <div className="bg-white p-4 rounded-lg w-[400px]">
          <div
            className="flex justify-between items-center my-3"
            onClick={() => setOpenAddExportItem(false)}
          >
            <ModalTitle>Thêm nguyên liệu</ModalTitle>
            <FontAwesomeIcon icon={faX} className="cursor-pointer" />
          </div>
          <FormAddExportItem
            setExportItems={setExportItems}
            closeModal={() => setOpenAddExportItem(false)}
          />
        </div>
      </Modal>
    </Fragment>
  );
};

export default FormAddExportNote;
