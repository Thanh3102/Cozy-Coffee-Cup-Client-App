import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { Tab, TabContainer } from "../ui/TabContainer";
import TabDefinitionUnit from "../feature/tabs/TabDefinitionUnit";
import TabDefinitionCategory from "../feature/tabs/TabDefinitionCategory";
import TabDefinitionType from "../feature/tabs/TabDefinitionType";
import TabDefinitionOption from "../feature/tabs/TabDefinitionOption";

const DefinitionContent = () => {
  const tabs: Tab[] = [
    {
      title: "Đơn vị tính",
      content: <TabDefinitionUnit />,
    },
    {
      title: "Danh mục",
      content: <TabDefinitionCategory />,
    },
    {
      title: "Loại sản phẩm",
      content: <TabDefinitionType />,
    },
    {
      title: "Tùy chọn",
      content: <TabDefinitionOption />,
    },
  ];
  return (
    <ContentContainer>
      <TabContainer tabs={tabs} />
    </ContentContainer>
  );
};

const Definition = () => {
  return (
    <div className="flex">
      <Sidebar />
      <DefinitionContent />
    </div>
  );
};

export default Definition;
