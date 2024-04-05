import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";

const WarehouseContent = () => {
  return (
    <ContentContainer>
      <h1>Warehouse Content</h1>
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
