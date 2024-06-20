import { motion } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ProductOption } from "../../../utils/types/type";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormAddProductOption from "../forms/FormAddProductOption";
import ProductApi from "../../../api/Product";
import FormSearchProductOption from "../forms/FormSearchProductOption";
import ProductOptionTable from "../tables/TableProductOption";

const TabDefinitionOption = () => {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchOptions = async () => {
    const productApi = new ProductApi();
    const options = await productApi.getAllOption();
    setOptions(options);
  };

  useEffect(() => {
    fetchOptions();
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
            Danh sách tùy chọn
          </h5>
          <FormSearchProductOption setOptions={setOptions} />
          <ProductOptionTable options={options} fetchOptions={fetchOptions} />
        </div>
      </motion.div>
      <Modal open={openAdd}>
        <ModalTitle>Thêm tùy chọn mới</ModalTitle>
        <FormAddProductOption
          fetchOptions={fetchOptions}
          closeModal={() => setOpenAdd(false)}
        />
      </Modal>
    </Fragment>
  );
};

export default TabDefinitionOption;
