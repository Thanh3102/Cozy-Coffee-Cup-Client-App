import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";

interface Props extends BaseProps {
  closeModal: () => void;
  fetchUnit: () => void;
}

type Inputs = {
  name: string;
  short: string;
};

const FormAddUnit = ({ closeModal, fetchUnit }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axiosClient.post<
        Inputs,
        { status: number; message: string }
      >("/api/material/createUnit", data);
      if (response.status === 200) {
        toast.success(response.message);
      }
      fetchUnit();
      closeModal();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };
  return (
    <form
      className="min-w-[20vw] flex flex-col gap-4 mt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="">Tên đơn vị</label>
        <input
          type="text"
          className="input"
          {...register("name", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Tên viết tắt {"(Nếu có)"}</label>
        <input type="text" className="input" {...register("short")} />
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          size="small"
          type="button"
          color="danger"
          icon={<FontAwesomeIcon icon={faX} />}
          onClick={closeModal}
        >
          Hủy
        </Button>
        <Button
          size="small"
          type="submit"
          color="success"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Thêm
        </Button>
      </div>
    </form>
  );
};

export default FormAddUnit;
