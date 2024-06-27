import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { Tab, TabContainer } from "../ui/TabContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUser,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import TabAccountManagement from "../feature/tabs/TabAccountManagement";
import TabAccountRole from "../feature/tabs/TabAccountRole";

const Content = () => {
  const Tabs: Tab[] = [
    {
      title: "Tài khoản",
      icon: <FontAwesomeIcon icon={faUser} />,
      content: <TabAccountManagement />,
    },
    {
      title: "Vai trò",
      icon: <FontAwesomeIcon icon={faUserShield} />,
      content: <TabAccountRole />,
    },
  ];
  return (
    <ContentContainer>
      <TabContainer tabs={Tabs} />
    </ContentContainer>
  );
};

const Account = () => {
  return (
    <Fragment>
      <Sidebar />
      <Content />
    </Fragment>
  );
};

export default Account;
