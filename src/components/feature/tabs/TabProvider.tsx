import { motion } from "framer-motion";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { Fragment, useEffect, useState } from "react";
import { Provider } from "../../../utils/types/type";
import axiosClient from "../../../lib/axios";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../../ui/Modal";
import FormAddProvider from "../forms/FormAddProvider";
import FormEditProvider from "../forms/FormEditProvider";

const TabProvider = () => {
  const [openAddProvider, setOpenAddProvider] = useState<boolean>(false);
  const [openEditProvider, setOpenEditProvider] = useState<boolean>(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const fetchProvider = async () => {
    const { providers } = await axiosClient.get<
      void,
      { providers: Provider[] }
    >("/api/provider/getAll");
    setProviders(providers);
  };

  const handleEditProvider = (index: number) => {
    setSelectedIndex(index);
    setOpenEditProvider(true);
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-3 py-3 bg-white rounded-lg"
      >
        <div className="flex justify-end py-2">
          <Button
            size="small"
            color="success"
            onClick={() => setOpenAddProvider(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Thêm mới
          </Button>
        </div>
        <Table height={500}>
          <TableHead sticky>
            <TableRow>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers.map((provider, index) => {
              return (
                <TableRow key={provider.id}>
                  <TableCell>
                    <span
                      className="text-blue-500 hover:cursor-pointer hover:underline"
                      onClick={() => handleEditProvider(index)}
                    >
                      {provider.name}
                    </span>
                  </TableCell>
                  <TableCell>{provider.address}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell align="center">
                    {provider.active ? (
                      <span className="cursor-default px-2 py-1 text-[14px] font-semibold  rounded-2xl bg-green-200 text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="cursor-default px-2 py-1 text-[14px] font-semibold  rounded-2xl bg-red-200 text-red-600">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
      <Modal open={openAddProvider}>
        <div className="bg-white p-5 rounded-lg w-[500px]">
          <div
            className="flex justify-between cursor-pointer py-1"
            onClick={() => {
              setOpenAddProvider(false);
            }}
          >
            <ModalTitle>Thêm nhà cung cấp mới</ModalTitle>
            <FontAwesomeIcon icon={faX} />
          </div>
          <FormAddProvider
            closeModal={() => setOpenAddProvider(false)}
            fetchProvider={fetchProvider}
          />
        </div>
      </Modal>
      {openEditProvider && (
        <Modal open={openEditProvider}>
          <div className="bg-white p-5 rounded-lg w-[500px]">
            <div
              className="flex justify-between cursor-pointer py-1"
              onClick={() => {
                setOpenEditProvider(false);
              }}
            >
              <ModalTitle>Thông tin nhà cung cấp</ModalTitle>
              <FontAwesomeIcon icon={faX} />
            </div>
            <FormEditProvider
              provider={providers[selectedIndex]}
              closeModal={() => setOpenEditProvider(false)}
              fetchProvider={fetchProvider}
            />
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default TabProvider;
