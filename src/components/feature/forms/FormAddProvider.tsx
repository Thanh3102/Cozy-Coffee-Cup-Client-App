import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { BaseProps } from "../../../utils/types/interface";
import ProviderApi from "../../../api/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug,
  faPlus,
  faRotate,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  closeModal: () => void;
  fetchProvider: () => void;
}

const providerSchema = z.object({
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  address: z.string().min(1, { message: "Chưa nhập giá trị" }),
  email: z
    .string()
    .min(1, { message: "Chưa nhập giá trị" })
    .email({ message: "Định dạng email không đúng" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Chỉ chứa số" })
    .length(10, { message: "Số điện thoại không hợp lệ" }),
});

type Inputs = z.infer<typeof providerSchema>;

const FormAddProvider = ({ closeModal, fetchProvider }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(providerSchema) });
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
        className="flex flex-col gap-2 w-[25vw] min-w-[250px]"
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
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            className="input"
            id="address"
            {...register("address", { required: true })}
          />
          {errors.address && (
            <ErrorMessage>{errors.address.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            className="input"
            id="phone"
            {...register("phone")}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="input"
            id="email"
            {...register("email")}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
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
