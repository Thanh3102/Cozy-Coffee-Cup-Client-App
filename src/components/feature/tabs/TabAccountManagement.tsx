import { Fragment } from "react/jsx-runtime";

import { useEffect, useState } from "react";
import { Account } from "../../../utils/types/type";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import AccountApi from "../../../api/Account";
import Loading from "../../ui/Loading";
import AccountTable from "../tables/TableAccount";
import Paginition from "../../ui/Paginition";
import Modal from "../../ui/Modal";
import FormAddAccount from "../forms/FormAddAccount";

const TabAccountManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchAccounts = async () => {
    const accountApi = new AccountApi();
    setLoading(true);
    const accounts = await accountApi.getAll();
    setLoading(false);
    setAccounts(accounts);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center p-2 rounded-md border-gray-500 border-[2px]">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="outline-none flex-1 mx-2"
              />
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <Button
              size="small"
              color="success"
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setOpenAdd(true)}
            >
              Thêm mới
            </Button>
          </div>
        </div>
        <AccountTable accounts={accounts} fetchAccounts={fetchAccounts} />
        <Paginition
          count={accounts.length}
          page={page}
          onItemPerPageChange={(itemPerPage) => {
            setItemPerPage(itemPerPage);
          }}
          onPageChange={(page) => {
            setPage(page);
          }}
          position="right"
        />
      </div>
      <Modal open={openAdd}>
        <h4 className="text-2xl font-semibold">Thêm tài khoản mới</h4>
        <FormAddAccount
          close={() => setOpenAdd(false)}
          fetchAccounts={fetchAccounts}
        />
      </Modal>
    </Fragment>
  );
};

export default TabAccountManagement;
