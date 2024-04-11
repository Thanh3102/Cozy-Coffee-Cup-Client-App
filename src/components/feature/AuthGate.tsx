import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { refreshToken } from "../../redux/slices/authSlice";

interface Props extends BaseProps {}

const AuthGate = ({ children }: Props) => {
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const refresh = async () => {
    await dispatch(refreshToken());
  };
  useEffect(() => {
    console.log("Refresh new access token");
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
        <h1>Loading...</h1>
      </Fragment>
    );
  } else return <Fragment>{children}</Fragment>;
};

export default AuthGate;
