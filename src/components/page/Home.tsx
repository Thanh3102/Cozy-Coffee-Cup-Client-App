import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Button from "../ui/Button";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../ui/Sidebar";

const HomeContent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className="ml-[--sidebar-width] p-4 flex-1 h-[2000px]">
      <h1>Homepage</h1>
      <h4 className="font-semibold">User info</h4>
      <p>Id: {user?.id}</p>
      <p>{`Name: ${user?.name} (${user?.username})`}</p>
      <Button
        size="small"
        color="danger"
        onClick={async () => {
          await dispatch(logout());
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <HomeContent />
    </div>
  );
};

export default Home;
