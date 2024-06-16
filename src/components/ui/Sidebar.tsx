import {
  faArrowRightFromBracket,
  faChair,
  faClipboardList,
  faHome,
  faMarker,
  faMoneyBill1Wave,
  faMugSaucer,
  faUserLock,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";

interface Item {
  name: string;
  icon?: ReactElement;
  to: string;
}

const itemList: Item[] = [
  {
    name: "Trang chủ",
    icon: <FontAwesomeIcon icon={faHome} />,
    to: "/",
  },
  {
    name: "Tài khoản",
    icon: <FontAwesomeIcon icon={faUserLock} />,
    to: "/user",
  },
  // {
  //   name: "Phục vụ",
  //   icon: <FontAwesomeIcon icon={faChair} />,
  //   to: "/service",
  // },
  {
    name: "Hóa đơn",
    icon: <FontAwesomeIcon icon={faClipboardList} />,
    to: "/order",
  },
  {
    name: "Kho",
    icon: <FontAwesomeIcon icon={faWarehouse} />,
    to: "/warehouse",
  },
  {
    name: "Sản phẩm",
    icon: <FontAwesomeIcon icon={faMugSaucer} />,
    to: "/product",
  },
  {
    name: "Định nghĩa",
    icon: <FontAwesomeIcon icon={faMarker} />,
    to: "/definition",
  },
];

const ItemList = ({
  items,
  activePath,
}: {
  items: Item[];
  activePath: string;
}) => {
  return (
    <ul>
      {items.map((item: Item, index) => {
        return (
          <li
            key={index}
            className={`py-5 px-8 hover:cursor-pointer ${
              activePath === item.to
                ? "text-amber-700 border-r-[3px] border-r-amber-700"
                : null
            } hover:text-amber-700 hover:bg-[#F5F7FF]`}
          >
            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.98 }}>
              <Link to={item.to} className="flex items-center">
                <div className="w-[20px]">{item.icon}</div>
                <span className="ml-2">{item.name}</span>
              </Link>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
};

const UserProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="absolute bottom-0 px-8">
      <div className="">User: {user.name}</div>
      <motion.div
        className="cursor-pointer pb-6 pt-3"
        whileHover={{ scale: 1.105, color: "red" }}
        onClick={logoutUser}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span className="ml-2">Logout</span>
      </motion.div>
    </div>
  );
};

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <div className="bg-white min-h-screen fixed top-0 left-0 bottom-0 w-[--sidebar-width] text-[#778591]">
      <Logo />
      <ItemList items={itemList} activePath={pathname} />
      <UserProfile />
    </div>
  );
};

export default Sidebar;
