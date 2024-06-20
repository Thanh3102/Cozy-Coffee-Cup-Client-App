import { SubmitHandler, useForm } from "react-hook-form";
import MaterialApi from "../../../api/Material";
import { Dispatch, SetStateAction } from "react";
import { HistoryListItem } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props {
  setHistoryList: Dispatch<SetStateAction<HistoryListItem[]>>;
}

type Inputs = {
  type: string;
  start: string;
  end: string;
  name: string;
};

const FormFilterExportImportNote = ({ setHistoryList }: Props) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({
    start,
    end,
    type,
    name,
  }) => {
    const materialApi = new MaterialApi();
    const notes = await materialApi.getAllUnVoidNoteByFilter(
      start,
      end,
      type,
      name
    );
    setHistoryList(notes);
  };
  return (
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
          <input className="input" type="text" id="" {...register("name")} />
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
        <Button
          size="small"
          type="submit"
          form="historyNoteFilter"
          icon={<FontAwesomeIcon icon={faSearch} />}
        >
          Tìm kiếm
        </Button>
        <Button
          size="small"
          type="button"
          color="warning"
          onClick={() => {
            reset();
          }}
          icon={<FontAwesomeIcon icon={faRotate} />}
        >
          Làm mới
        </Button>
      </div>
    </div>
  );
};

export default FormFilterExportImportNote;
