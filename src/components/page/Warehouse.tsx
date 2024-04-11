import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { Tab, TabContainer } from "../ui/TabContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLemon,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import TabMaterial from "../feature/tabs/TabMaterial";
import TabProvider from "../feature/tabs/TabProvider";
import TabImportExportHistory from "../feature/tabs/TabImportExportHistory";

const tabs: Tab[] = [
  {
    title: "Nguyên liệu",
    icon: <FontAwesomeIcon icon={faLemon} />,
    content: <TabMaterial />,
  },
  {
    title: "Nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruckFast} />,
    content: <TabProvider />,
  },
  {
    title: "Lịch sử nhập xuất",
    icon: <FontAwesomeIcon icon={faClock} />,
    content: <TabImportExportHistory />,
  },
];

const WarehouseContent = () => {
  return (
    <ContentContainer>
      <TabContainer tabs={tabs} />
    </ContentContainer>
  );
};

const Warehouse = () => {
  return (
    <Fragment>
      <Sidebar />
      <WarehouseContent />
    </Fragment>
  );
};

export default Warehouse;
