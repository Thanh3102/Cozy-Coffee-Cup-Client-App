import { motion } from "framer-motion";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown, faCircleUp } from "@fortawesome/free-regular-svg-icons";
import { Fragment, useEffect, useRef, useState } from "react";
import Modal, { ModalTitle } from "../../ui/Modal";
import Paginition from "../../ui/Paginition";
import { Material } from "../../../utils/types/type";
import axiosClient from "../../../lib/axios";
import { formatDate } from "../../../utils/dateFormat";
import FormAddMaterial from "../forms/FormAddMaterial";
import FormAddImportNote from "../forms/FormAddImportNote";
import FormAddExportNote from "../forms/FormAddExportNote";
import FormEditMaterial from "../forms/FormEditMaterial";
import { toast } from "react-toastify";

const TabMaterial = () => {
  const [openAddMaterial, setOpenAddMaterial] = useState<boolean>(false);
  const [openEditMaterial, setOpenEditMaterial] = useState<boolean>(false);
  const [openAddImportNote, setOpenAddImportNote] = useState<boolean>(false);
  const [openAddExportNote, setOpenAddExportNote] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const previousController = useRef<AbortController>();

  const fetchMaterialData = async () => {
    const response = await axiosClient.get<
      void,
      { data: Material[]; count: number }
    >(`/api/material/getAll?page=${page}&item=${itemPerPage}`);
    setMaterials(response.data);
    setCount(response.count);
  };
  const handleSearchMaterial = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (previousController.current) {
        previousController.current.abort();
      }
      const controller = new AbortController();
      const signal = controller.signal;
      previousController.current = controller;
      const response = await axiosClient.get<void, { materials: Material[] }>(
        `/api/material/search?q=${e.target.value}`,
        {
          signal: signal,
        }
      );
      // console.log(response.materials);
      setMaterials(response.materials);
    } catch (error: any) {
      console.log(error);
    }
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
          <form className="flex py-2 pl-2 items-center border-r-[1px] border-solid">
            <FontAwesomeIcon icon={faSearch} className="text-[#9CA3B7]" />
            <input
              className="input border-none w-[400px]"
              type="text"
              placeholder="Nhập từ khóa tìm kiếm"
              onChange={handleSearchMaterial}
            />
          </form>
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
        <Table height={500}>
          <TableHead sticky>
            <TableRow>
              <TableCell>Tên nguyên liệu</TableCell>
              <TableCell>Số lượng tồn kho</TableCell>
              <TableCell>Lần nhập gần nhất</TableCell>
              <TableCell>Lần sử dụng gần nhất</TableCell>
              <TableCell>Hạn sử dụng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <span
                      onClick={() => {
                        setSelectedMaterial(item);
                        setOpenEditMaterial(true);
                      }}
                      className="text-blue-500 hover:cursor-pointer hover:underline"
                    >
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell>{`${item.stock_quantity} (${
                    item.unit.short ? item.unit.short : item.unit.name
                  })`}</TableCell>
                  <TableCell>
                    {item.latest_import_date
                      ? formatDate(item.latest_import_date)
                      : "Không"}
                  </TableCell>
                  <TableCell>
                    {item.latest_export_date
                      ? formatDate(item.latest_export_date)
                      : "Không"}
                  </TableCell>
                  <TableCell>
                    {item.expiration_date
                      ? formatDate(item.expiration_date)
                      : "Không"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
        <div
          className="flex items-center justify-between py-1"
          onClick={() => {
            setOpenAddImportNote(false);
          }}
        >
          <ModalTitle>Phiếu nhập kho</ModalTitle>
          <FontAwesomeIcon icon={faX} className="cursor-pointer" />
        </div>
        <FormAddImportNote
          closeModal={() => setOpenAddImportNote(false)}
          reFetchMaterial={() => fetchMaterialData()}
        />
      </Modal>
      <Modal open={openAddExportNote}>
        <div
          className="flex justify-between items-center py-1"
          onClick={() => {
            setOpenAddExportNote(false);
          }}
        >
          <ModalTitle>Phiếu xuất kho</ModalTitle>
          <FontAwesomeIcon icon={faX} className="cursor-pointer" />
        </div>
        <FormAddExportNote
          closeModal={() => setOpenAddExportNote(false)}
          reFetchMaterial={() => fetchMaterialData()}
        />
      </Modal>
      {selectedMaterial && (
        <Modal open={openEditMaterial}>
          <ModalTitle>Thông tin nguyên liệu</ModalTitle>
          <FormEditMaterial
            reFetch={fetchMaterialData}
            closeModal={() => setOpenEditMaterial(false)}
            material={selectedMaterial}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default TabMaterial;
