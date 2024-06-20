import { motion } from "framer-motion";

import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown, faCircleUp } from "@fortawesome/free-regular-svg-icons";
import { Fragment, useEffect, useState } from "react";
import Modal, { ModalTitle } from "../../ui/Modal";
import Paginition from "../../ui/Paginition";
import { Material } from "../../../utils/types/type";
import FormAddMaterial from "../forms/FormAddMaterial";
import FormAddImportNote from "../forms/FormAddImportNote";
import FormAddExportNote from "../forms/FormAddExportNote";
import MaterialApi from "../../../api/Material";
import FormSearchMaterial from "../forms/FormSearchMaterial";
import MaterialTable from "../tables/TableMaterial";

const TabMaterial = () => {
  const [openAddMaterial, setOpenAddMaterial] = useState<boolean>(false);

  const [openAddImportNote, setOpenAddImportNote] = useState<boolean>(false);
  const [openAddExportNote, setOpenAddExportNote] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const fetchMaterialData = async () => {
    const materialApi = new MaterialApi();
    const { data, count } = await materialApi.getMaterialByFilter(
      page,
      itemPerPage
    );
    setCount(count);
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterialData();
  }, [page, itemPerPage]);

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-3 py-1 bg-white rounded-lg"
      >
        <div className="flex justify-between bg-white py-1">
          <FormSearchMaterial setMaterials={setMaterials} />
          <div className="flex gap-2 py-2">
            <Button size="small" onClick={() => setOpenAddImportNote(true)}>
              <FontAwesomeIcon icon={faCircleDown} />
              Tạo phiếu nhập
            </Button>
            <Button size="small" onClick={() => setOpenAddExportNote(true)}>
              <FontAwesomeIcon icon={faCircleUp} />
              Tạo phiếu xuất
            </Button>
            <Button
              size="small"
              color="success"
              onClick={() => setOpenAddMaterial(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm mới
            </Button>
          </div>
        </div>
        <MaterialTable
          materials={materials}
          fetchMaterial={fetchMaterialData}
        />
        <Paginition
          position="right"
          itemPerPage={itemPerPage}
          page={page}
          count={count}
          onItemPerPageChange={(page) => {
            setItemPerPage(page);
            setPage(1);
          }}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </motion.div>

      <Modal open={openAddMaterial}>
        <ModalTitle>Thêm nguyên liệu</ModalTitle>
        <FormAddMaterial
          reFetch={fetchMaterialData}
          closeModal={() => setOpenAddMaterial(false)}
        />
      </Modal>
      <Modal open={openAddImportNote}>
        <ModalTitle>Phiếu nhập kho</ModalTitle>
        <FormAddImportNote
          closeModal={() => setOpenAddImportNote(false)}
          reFetchMaterial={() => fetchMaterialData()}
        />
      </Modal>
      <Modal open={openAddExportNote}>
        <ModalTitle>Phiếu xuất kho</ModalTitle>
        <FormAddExportNote
          closeModal={() => setOpenAddExportNote(false)}
          reFetchMaterial={() => fetchMaterialData()}
        />
      </Modal>
    </Fragment>
  );
};

export default TabMaterial;
