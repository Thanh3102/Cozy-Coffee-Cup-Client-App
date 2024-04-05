import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { refreshToken } from "../../redux/slices/authSlice";

interface Props extends BaseProps {}

const AuthGate = ({ children }: Props) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const refresh = async () => {
    await dispatch(refreshToken());
  };
  useEffect(() => {
    console.log("Refresh new access token");
    refresh();
  }, []);
  return <Fragment>{children}</Fragment>;
};

export default AuthGate;
