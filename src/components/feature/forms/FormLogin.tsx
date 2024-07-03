import { memo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { signInUser } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

const loginSchema = z.object({
  username: z.string().min(1, "Chưa nhập tên đăng nhập"),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải từ 6 - 30 kí tự" })
    .max(30, { message: "Mật khẩu phải từ 6 - 30 kí tự" }),
});

type SignInFormInput = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<SignInFormInput> = async (data) => {
    setIsLoading(true);

    // dispatch sign in action
    await dispatch(signInUser(data)).then((result) => {
      setIsLoading(false);
      if (result.type == "auth/signin/fulfilled") {
        toast.success("Đăng nhập thành công");
        navigate("/");
      } else {
        toast.error(
          "Tên đăng nhập hoặc mật khẩu không chính xác, vui lòng thử lại"
        );
      }
    });
  };

  return (
    <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 flex-col">
      <div className="bg-white p-16 rounded-lg w-[30vw] min-w-[450px] max-w-[600px] shadow-lg">
        <h3 className="text-amber-700 text-center text-3xl mb-10 font-bold flex justify-center items-center gap-4">
          <FontAwesomeIcon icon={faMugHot} />
          Cozy Coffee Cup
        </h3>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`input ${errors.username ? "" : "mb-8"}`}
            type="text"
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "Chưa nhập tên đăng nhập" },
            })}
          />
          {errors.username && (
            <ErrorMessage>{errors.username.message}</ErrorMessage>
          )}
          <input
            className={`input ${errors.password ? "" : "mb-8"}`}
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Chưa nhập mật khẩu" },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          <Button type="submit" className="w-full" loading={isLoading}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(FormLogin);
