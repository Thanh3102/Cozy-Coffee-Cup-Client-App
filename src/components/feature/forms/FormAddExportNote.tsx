import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../../ui/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import FormAddExportItem from "./FormAddExportItem";
import { ExportItem } from "../../../utils/types/type";
import { toast } from "react-toastify";
import { CreateExportNoteDto } from "../../../utils/types/dto";
import MaterialApi from "../../../api/Material";

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

    const dto: CreateExportNoteDto = {
      export_note_detail: exportList,
      ...data,
    };

    const materialApi = new MaterialApi();
    const message = await materialApi.createExportNote(dto);
    if (message !== null) {
      toast.success(message ?? "Đã tạo phiếu xuất kho");
    }
    closeModal();
    reFetchMaterial();
  };

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[30vw] min-w-[500px]"
      >
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
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
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
        <div className="flex justify-end mt-4 gap-4">
          <Button
            size="small"
            color="danger"
            icon={<FontAwesomeIcon icon={faX} />}
            onClick={closeModal}
          >
            Đóng
          </Button>

          <Button
            size="small"
            color="success"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Tạo
          </Button>
        </div>
      </form>
      <Modal open={openAddExportItem}>
        <ModalTitle>Thêm nguyên liệu</ModalTitle>
        <FormAddExportItem
          setExportItems={setExportItems}
          closeModal={() => setOpenAddExportItem(false)}
        />
      </Modal>
    </Fragment>
  );
};

export default FormAddExportNote;
