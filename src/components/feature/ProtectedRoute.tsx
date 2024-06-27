import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../utils/types/interface";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../ui/Loading";
import { Permission } from "../../utils/types/enum";

interface Props extends BaseProps {
  required_perm?: Permission
}

const ProtectedRoute = ({ required_perm, children }: Props) => {
  const { status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenciation") {
      navigate("/login");
    }
  });

  if (status == "pending") {
    return <Loading />;
  }
  if (status == "authenciation") {
    return <Fragment>{children}</Fragment>;
  }
  return <Fragment></Fragment>;
};

export default ProtectedRoute;
