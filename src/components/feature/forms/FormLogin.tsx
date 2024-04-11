import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import { SignInFormInput } from "../../../utils/types/interface";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { signInUser } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const FormLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>();
  const onSubmit: SubmitHandler<SignInFormInput> = async (data) => {
    setIsLoading(true);

    // dispatch sign in action
    const result = await dispatch(signInUser(data));

    setIsLoading(false);

    if (result.type == "auth/signin/fulfilled") {
      toast.success("Đăng nhập thành công");
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 flex-col">
      <div className="bg-white p-16 rounded-md w-[520px]">
        <h3 className="text-amber-700 text-center text-[28px] mb-10 font-bold flex justify-center items-center gap-4">
          <FontAwesomeIcon icon={faMugHot} />
          Cozy Coffee Cup
        </h3>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`input ${errors.username ? "" : "mb-8"}`}
            type="text"
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "Chưa nhập tên đăng nhập" },
            })}
          />
          {errors.username?.message ? (
            <p className="errorMessage">{errors.username?.message}</p>
          ) : null}
          <input
            className={`input ${errors.password ? "" : "mb-8"}`}
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Chưa nhập mật khẩu" },
            })}
          />
          {errors.password?.message ? (
            <p className="errorMessage">{errors.password?.message}</p>
          ) : null}
          <Button type="submit" className="w-full" loading={isLoading}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
