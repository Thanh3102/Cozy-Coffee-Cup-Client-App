import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";
import ProviderApi from "../../../api/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug, faPlus, faRotate, faX } from "@fortawesome/free-solid-svg-icons";

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
    const providerApi = new ProviderApi();
    const message = await providerApi.create(data);
    if (message !== null) {
      toast.success(message ?? "Đã thêm thành công");
    }
    closeModal();
    fetchProvider();
  };
  return (
    <Fragment>
      <form
        id="addProviderForm"
        className="flex flex-col gap-4 min-w-[60vh]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Tên nhà cung cấp</label>
          <input
            type="text"
            className="input"
            id="name"
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            className="input"
            id="address"
            {...register("address", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            className="input"
            id="phone"
            {...register("phone")}
          />
        </div>
        <div className="flex flex-col gap-1">
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
        <Button
          size="small"
          type="button"
          color="danger"
          onClick={closeModal}
          icon={<FontAwesomeIcon icon={faX} />}
        >
          Đóng
        </Button>
        <Button
          size="small"
          type="button"
          color="warning"
          onClick={reset}
          icon={<FontAwesomeIcon icon={faRotate} />}
        >
          Reset
        </Button>
        <Button
          size="small"
          type="submit"
          color="success"
          form="addProviderForm"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Thêm
        </Button>
      </div>
    </Fragment>
  );
};

export default FormAddProvider;
