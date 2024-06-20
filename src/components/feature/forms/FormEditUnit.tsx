import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Unit } from "../../../utils/types/type";
import Button from "../../ui/Button";
import MaterialApi from "../../../api/Material";

interface Props extends BaseProps {
  unit: Unit;
  closeModal: () => void;
  fetchUnit: () => void;
}

type Inputs = {
  name: string;
  short: string;
};

const FormEditUnit = ({ unit, closeModal, fetchUnit }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: unit.name,
      short: unit.short,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const materialApi = new MaterialApi();
    await materialApi.updateUnit({ id: unit.id, ...data });
    fetchUnit();
    closeModal();
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
          icon={<FontAwesomeIcon icon={faCheck} />}
        >
          Cập nhật
        </Button>
      </div>
    </form>
  );
};

export default FormEditUnit;
