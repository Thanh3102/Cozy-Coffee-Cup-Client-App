import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Button from "../ui/Button";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";

const HomeContent = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <ContentContainer>
      <h1>Homepage</h1>
      <h4 className="font-semibold">User info</h4>
      <p>Id: {user?.id}</p>
      <p>{`Name: ${user?.name} (${user?.username})`}</p>
    </ContentContainer>
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
