import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import { Provider } from "../../../utils/types/type";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import ProviderApi from "../../../api/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive, faX } from "@fortawesome/free-solid-svg-icons";
interface Props extends BaseProps {
  provider: Provider;
  closeModal: () => void;
  fetchProvider: () => void;
}

type Inputs = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  active: boolean;
};

const FormEditProvider = ({ provider, closeModal, fetchProvider }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: provider.id,
      name: provider.name,
      address: provider.address,
      phone: provider.phone,
      email: provider.email,
      active: provider.active,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const providerApi = new ProviderApi();
    const message = await providerApi.update(data);
    if (message !== null) {
      toast.success(message ?? "Đã cập nhật thông tin");
    }
    closeModal();
    fetchProvider();
  };
  return (
    <Fragment>
      <form
        id="editProviderForm"
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
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-[20px] h-[20px]"
            {...register("active")}
          />
          <span className="ml-4">Đang hoạt động</span>
        </div>
      </form>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          size="small"
          type="button"
          color="danger"
          onClick={() => closeModal()}
          icon={<FontAwesomeIcon icon={faX} />}
        >
          Hủy
        </Button>
        <Button
          size="small"
          type="submit"
          form="editProviderForm"
          color="success"
          icon={<FontAwesomeIcon icon={faFileArchive} />}
        >
          Lưu
        </Button>
      </div>
    </Fragment>
  );
};

export default FormEditProvider;
