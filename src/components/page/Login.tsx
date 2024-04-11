import { Fragment } from "react/jsx-runtime";
import FormLogin from "../feature/forms/FormLogin";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (status === "authenciation") {
    navigate("/");
    return (
      <Fragment>
        <h1>You have login</h1>
        <button onClick={() => navigate("/")}>Go to homepage</button>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <FormLogin />
    </Fragment>
  );
};

export default Login;
