import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { SubmitHandler, useForm } from "react-hook-form";
import AccountApi from "../../../api/Account";
import { toast } from "react-toastify";
import { Role } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../lib/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props {
  role: Role;
  fetchRole: () => void;
  close: () => void;
}

type Permission = { id: string; name: string };

const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  color: z.string(),
  perms: z.string().array(),
});

type Inputs = z.infer<typeof roleSchema>;

const FormEditRole = ({ role, close, fetchRole }: Props) => {
  const [permissions, setPermission] = useState<Permission[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      id: role.id,
      color: role.color,
      name: role.name,
    },
  });

  const fetchPermssions = async () => {
    try {
      const { permissions } = await axiosClient.get<
        void,
        { permissions: Permission[] }
      >("/api/user/getAllPermissions");
      setPermission(permissions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRolePermssions = async () => {
    try {
      const accountApi = new AccountApi();
      const perms = await accountApi.getRolePermission(role.id);
      setValue("perms", perms);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const accountApi = new AccountApi();
      const message = await accountApi.updateRole(data);
      toast.success(message);
      fetchRole();
      close();
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchPermssions();
    fetchRolePermssions();
  }, []);

  return (
    <Fragment>
      <form
        className="w-[35vw] min-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4">
          <div className="w-[80%] flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-lg">
              Tên vai trò
            </label>
            <input
              type="text"
              className="input"
              id="name"
              {...register("name", { required: true })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="w-[20%] flex flex-col gap-2">
            <label htmlFor="color" className="font-semibold text-lg">
              Màu sắc
            </label>
            <input
              type="color"
              id="color"
              className="h-8 w-8 outline-none border-none"
              {...register("color")}
            />
          </div>
        </div>
        <div className="mt-2">
          <h5 className="font-semibold text-lg">Quyền hạn</h5>
          <div className="flex flex-wrap -mx-4 gap-y-4 h-60 overflow-y-auto my-4">
            {permissions.map((perm) => {
              return (
                <div
                  className="px-4 w-1/2 flex items-center gap-2"
                  key={perm.id}
                >
                  <input
                    type="checkbox"
                    id={`cb-perm-${perm.id}`}
                    className="scale-125"
                    value={perm.id}
                    {...register("perms")}
                  />
                  <label
                    htmlFor={`cb-perm-${perm.id}`}
                    className="text-sm lg:text-base"
                  >
                    {perm.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-4">
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
            icon={<FontAwesomeIcon icon={faFileArchive} />}
          >
            Lưu
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default FormEditRole;
