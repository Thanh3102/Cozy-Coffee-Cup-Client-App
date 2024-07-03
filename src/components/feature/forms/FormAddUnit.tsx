import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseProps } from "../../../utils/types/interface";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import MaterialApi from "../../../api/Material";
import { z } from "zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  closeModal: () => void;
  fetchUnit: () => void;
}

const unitSchema = z.object({
  name: z.string().min(1, { message: "Chưa nhập tên danh mục" }),
  short: z.string(),
});

type Inputs = z.infer<typeof unitSchema>;

const FormAddUnit = ({ closeModal, fetchUnit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({resolver: zodResolver(unitSchema)});
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const materialApi = new MaterialApi();
    await materialApi.createUnit(data);
    fetchUnit();
    closeModal();
  };

  return (
    <form
      className="w-[20vw] min-w-[200px] flex flex-col gap-4 mt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="">Tên đơn vị</label>
        <input
          type="text"
          className="input"
          {...register("name", { required: true })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
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
