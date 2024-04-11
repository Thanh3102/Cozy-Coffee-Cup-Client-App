import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Props extends BaseProps {}

const ProtectedRoute = ({ children }: Props) => {
  const { status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenciation") {
      navigate("/login");
    }
  });

  if (status == "pending") {
    return (
      <Fragment>
        <h1>Loading...</h1>
      </Fragment>
    );
  }
  if (status == "authenciation") {
    return <Fragment>{children}</Fragment>;
  }
  return <Fragment></Fragment>;
};

export default ProtectedRoute;
