import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Role } from "../../../utils/types/type";
import AccountApi from "../../../api/Account";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props {
  fetchAccounts: () => void;
  close: () => void;
}

const accountSchema = z.object({
  username: z.string().min(1, { message: "Chưa nhập tên đăng nhập" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải từ 6 - 30 kí tự" })
    .max(30, { message: "Mật khẩu phải từ 6 - 30 kí tự" }),
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  roles: z.string().array(),
});

type FormInput = z.infer<typeof accountSchema>;

const FormAddAccount = ({ close, fetchAccounts }: Props) => {
  const [roles, setRoles] = useState<Role[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const accountApi = new AccountApi();
      const message = await accountApi.createAccount(data);
      toast.success(message);
      fetchAccounts();
      close();
    } catch (error: any) {
      toast.error(error ?? "Đã xảy ra lỗi");
      return;
    }
  };

  const fetchRoles = async () => {
    const accountApi = new AccountApi();
    const roles = await accountApi.getAllRole();
    setRoles(roles);
  };

  useEffect(() => {
    fetchRoles();
  });
  return (
    <Fragment>
      <form
        className="w-[40vw]"
        id="createAccountForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap gap-y-2 -mx-2">
          <div className="flex-col flex px-2 gap-1 lg:w-[33.33%] w-full">
            <label htmlFor="">Tên đăng nhập</label>
            <input
              type="text"
              className="input"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
            )}
          </div>
          <div className="flex-col flex px-2 gap-1 lg:w-[33.33%] w-full">
            <label htmlFor="">Mật khẩu</label>
            <input
              type="password"
              className="input"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="flex-col flex px-2 gap-1 lg:w-[33.33%] w-full">
            <label htmlFor="">Tên hiển thị</label>
            <input
              type="text"
              className="input"
              {...register("name", { required: true })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
        </div>
        <div className="mt-2 h-40 overflow-y-auto overflow-x-hidden">
          <h5>Vai trò</h5>
          <div className="flex flex-wrap -mx-3">
            {roles.map((role) => {
              return (
                <div className="px-4 w-[50%] items-center" key={role.id}>
                  <input
                    type="checkbox"
                    className="scale-110 mr-2"
                    value={role.id}
                    id={`create_account_form_role_${role.id}`}
                    {...register("roles")}
                  />
                  <label
                    htmlFor={`create_account_form_role_${role.id}`}
                    style={{ color: role.color }}
                  >
                    {role.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </form>
      <div className="flex gap-4 justify-end">
        <Button
          size="small"
          color="danger"
          type="button"
          icon={<FontAwesomeIcon icon={faX} />}
          onClick={close}
        >
          Đóng
        </Button>
        <Button
          size="small"
          color="success"
          type="submit"
          form="createAccountForm"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Tạo
        </Button>
      </div>
    </Fragment>
  );
};

export default FormAddAccount;
