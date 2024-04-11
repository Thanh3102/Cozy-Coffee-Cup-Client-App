import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";

interface Props extends BaseProps {
  closeModal: () => void;
  fetchProvider: () => void;
}

type Inputs = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

const FormAddProvider = ({ closeModal, fetchProvider }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    const response = await axiosClient.post("/api/provider/create", data);
    if (response.status === 200) {
      toast.success("Đã thêm thành công");
      reset();
      closeModal();
      fetchProvider();
    }
  };
  return (
    <Fragment>
      <form
        id="addProviderForm"
        className="grid gap-4 grid-cols-2 grid-rows-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-1 flex flex-col gap-1">
          <label htmlFor="name">Tên nhà cung cấp</label>
          <input
            type="text"
            className="input"
            id="name"
            {...register("name", { required: true })}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            className="input"
            id="address"
            {...register("address", { required: true })}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            className="input"
            id="phone"
            {...register("phone")}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="input"
            id="email"
            {...register("email")}
          />
        </div>
      </form>
      <div className="flex justify-center gap-2 mt-4">
        <Button size="small" type="button" color="warning" onClick={reset}>
          Reset
        </Button>
        <Button size="small" type="submit" form="addProviderForm">
          Thêm
        </Button>
      </div>
    </Fragment>
  );
};

export default FormAddProvider;
