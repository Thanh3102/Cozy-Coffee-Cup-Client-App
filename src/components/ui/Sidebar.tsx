import {
  faBell,
  faHome,
  faMoneyBill1Wave,
  faMugSaucer,
  faUserLock,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

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
    to: "/account",
  },
  {
    name: "Đơn phục vụ",
    icon: <FontAwesomeIcon icon={faBell} />,
    to: "/order",
  },
  {
    name: "Thanh toán",
    icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
    to: "/payment",
  },
  {
    name: "Kho nguyên liệu",
    icon: <FontAwesomeIcon icon={faWarehouse} />,
    to: "/storage",
  },
  {
    name: "Menu",
    icon: <FontAwesomeIcon icon={faMugSaucer} />,
    to: "/menu",
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
          <motion.li
            whileHover={{ scale: 1.1 }}
            className={`py-5 px-8 hover:cursor-pointer ${
              activePath === item.to ? "text-amber-700" : "text-[#778591]"
            } hover:text-amber-700 hover:bg-[#F5F7FF]`}
          >
            <Link to={item.to} className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
};

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-white min-h-screen fixed top-0 left-0 bottom-0 w-[--sidebar-width]">
      <Logo />
      <ItemList items={itemList} activePath={pathname} />
    </div>
  );
};

export default Sidebar;
