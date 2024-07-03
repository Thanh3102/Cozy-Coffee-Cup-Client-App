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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";
interface Props extends BaseProps {
  provider: Provider;
  closeModal: () => void;
  fetchProvider: () => void;
}

const providerSchema = z.object({
  id: z.string(),
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
  active: z.boolean(),
});

type Inputs = z.infer<typeof providerSchema>;

const FormEditProvider = ({ provider, closeModal, fetchProvider }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(providerSchema),
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
