import { motion } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Unit } from "../../../utils/types/type";
import Modal, { ModalTitle } from "../../ui/Modal";
import FormAddUnit from "../forms/FormAddUnit";
import MaterialApi from "../../../api/Material";
import FormSearchUnit from "../forms/FormSearchUnit";
import UnitDefinitionTable from "../tables/TableUnit";

const TabCustomUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchUnit = async () => {
    const materialApi = new MaterialApi();
    const units = await materialApi.fetchUnit();
    setUnits(units);
  };

  useEffect(() => {
    fetchUnit();
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
            Danh sách đơn vị tính
          </h5>
          <FormSearchUnit setUnits={setUnits} />
          <UnitDefinitionTable units={units} fetchUnit={fetchUnit} />
        </div>
      </motion.div>
      <Modal open={openAdd}>
        <ModalTitle>Thêm đơn vị đo</ModalTitle>
        <FormAddUnit
          closeModal={() => setOpenAdd(false)}
          fetchUnit={fetchUnit}
        />
      </Modal>
    </Fragment>
  );
};

export default TabCustomUnit;
