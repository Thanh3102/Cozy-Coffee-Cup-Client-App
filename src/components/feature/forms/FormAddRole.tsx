import { Fragment } from "react/jsx-runtime";
import axiosClient from "../../../lib/axios";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import AccountApi from "../../../api/Account";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props {
  close: () => void;
  fetchRoles: () => void;
}

type Permission = { id: string; name: string };

const roleSchema = z.object({
  name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  color: z.string(),
  perms: z.string().array(),
});

type Inputs = z.infer<typeof roleSchema>;

const FormAddRole = ({ close, fetchRoles }: Props) => {
  const [permissions, setPermission] = useState<Permission[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      color: "#686D76",
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const accountApi = new AccountApi();
      const message = await accountApi.createRole(data);
      toast.success(message);
      fetchRoles();
      close();
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchPermssions();
  }, []);

  return (
    <Fragment>
      <form
        className="w-[35vw] min-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4">
          <div className="w-[80%] flex flex-col gap-2">
            <label htmlFor="">Tên vai trò</label>
            <input
              type="text"
              className="input"
              {...register("name", { required: true })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="w-[20%] flex flex-col gap-2">
            <label htmlFor="">Màu sắc</label>
            <input
              type="color"
              // defaultValue={"#686D76"}
              className="h-8 w-8 outline-none border-none"
              {...register("color")}
            />
          </div>
        </div>
        <div className="mt-2">
          <h5>Quyền hạn</h5>
          <div className="flex flex-wrap -mx-4 gap-y-4 h-60 overflow-y-auto my-4 overflow-x-hidden">
            {permissions.map((perm) => {
              return (
                <div className="px-4 w-1/2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`cb-perm-${perm.id}`}
                    className="scale-125"
                    value={perm.id}
                    {...register("perms")}
                  />
                  <label
                    htmlFor={`cb-perm-${perm.id}`}
                    className="lg:text-base text-sm"
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
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default FormAddRole;
