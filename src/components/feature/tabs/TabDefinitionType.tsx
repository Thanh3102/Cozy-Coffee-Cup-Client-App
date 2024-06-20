import { motion } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axiosClient from "../../../lib/axios";
import { ProductType } from "../../../utils/types/type";
import { toast } from "react-toastify";
import Modal, { ModalTitle } from "../../ui/Modal";
import FormAddProductType from "../forms/FormAddProductType";
import FormSearchProductType from "../forms/FormSearchProductType";
import ProductTypeTable from "../tables/TableProductType";
import ProductApi from "../../../api/Product";

const TabDefinitionType = () => {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchProductType = async () => {
    const productApi = new ProductApi();
    const types = await productApi.getAllType();
    setTypes(types);
  };

  useEffect(() => {
    fetchProductType();
  }, []);

  return (
    <Fragment>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button
          color="success"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setOpenAdd(true)}
        >
          Thêm mới
        </Button>
        <div className="bg-white p-4 mt-2 rounded-md">
          <h5 className="font-semibold text-[22px] text-amber-700">
            Danh sách loại sản phẩm
          </h5>
          <FormSearchProductType setTypes={setTypes} />
          <ProductTypeTable types={types} fetchProductType={fetchProductType} />
        </div>
      </motion.div>
      <Modal open={openAdd}>
        <ModalTitle>Thêm loại sản phẩm</ModalTitle>
        <FormAddProductType
          close={() => setOpenAdd(false)}
          fetchProductType={fetchProductType}
        />
      </Modal>
    </Fragment>
  );
};

export default TabDefinitionType;
