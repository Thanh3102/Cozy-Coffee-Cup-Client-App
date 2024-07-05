import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { refreshToken } from "../../redux/slices/authSlice";
import Loading from "../ui/Loading";

interface Props extends BaseProps {}

const AuthGate = ({ children }: Props) => {
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const refresh = async () => {
    await dispatch(refreshToken());
  };
  useEffect(() => {
    refresh();
    const intervalId = setInterval(() => {
      console.log("Interval refresh token");
      refresh();
    }, 1000 * 14 * 60);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  if (status === "pending") {
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );
  } else return <Fragment>{children}</Fragment>;
};

export default AuthGate;
