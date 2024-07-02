import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { Account } from "../../../utils/types/type";
import {
  faCheck,
  faGear,
  faKey,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditAccount from "../forms/FormEditAccount";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import AccountApi from "../../../api/Account";

interface Props {
  accounts: Account[];
  fetchAccounts: () => void;
}

const AccountTable = ({ accounts, fetchAccounts }: Props) => {
  const [lastSelectedItem, setLastSelectedItem] = useState<Account>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReset, setOpenReset] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      const accountApi = new AccountApi();
      if (lastSelectedItem) {
        const message = await accountApi.deleteAccount(lastSelectedItem.id);
        toast.success(message);
        fetchAccounts();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  const handleReset = async () => {
    try {
      const accountApi = new AccountApi();
      if (lastSelectedItem) {
        const message = await accountApi.resetPassword(lastSelectedItem.id);
        toast.success(message);
        fetchAccounts();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Fragment>
      <Table height={"60vh"}>
        <TableHead bgColor={"#37B7C3"}>
          <TableRow>
            <TableCell className="table-cell max-w-0">Tên</TableCell>
            <TableCell className="table-cell max-w-0">Vai trò</TableCell>
            <TableCell className="table-cell max-w-0">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="table-cell max-w-0">
                {`${account.name} (${account.username})`}
              </TableCell>
              <TableCell className="table-cell max-w-0">
                <div className="flex flex-wrap -my-1">
                  {account.roles.length !== 0 ? (
                    account.roles.map((role) => (
                      <div
                        key={role.id}
                        className="px-3 py-1 text-white rounded-xl pointer-events-none mr-2 lg:text-sm text-xs my-1"
                        style={{ backgroundColor: role.color }}
                      >
                        {role.name}
                      </div>
                    ))
                  ) : (
                    <span>Không có vai trò</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="table-cell max-w-0">
                <div className="flex gap-4 hover:cursor-pointer">
                  <div
                    className="flex gap-2 items-center hover:text-green-500 lg:text-base text-lg"
                    onClick={() => {
                      setLastSelectedItem(account);
                      setOpenEdit(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faGear} />
                    <span className="hidden lg:inline-block">Chỉnh sửa</span>
                  </div>
                  <div
                    className="flex gap-2 items-center hover:text-yellow-500 lg:text-base text-lg"
                    onClick={() => {
                      setLastSelectedItem(account);
                      setOpenReset(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faKey} />
                    <span className="hidden lg:inline-block">Đặt lại mật khẩu</span>
                  </div>
                  <div
                    className="flex gap-2 items-center hover:text-red-500 lg:text-base text-lg"
                    onClick={() => {
                      setLastSelectedItem(account);
                      setOpenDelete(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span className="hidden lg:inline-block">Xóa</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {lastSelectedItem && (
        <Modal open={openEdit}>
          <ModalTitle>Cập nhật tài khoản</ModalTitle>
          <FormEditAccount
            id={lastSelectedItem.id}
            close={() => setOpenEdit(false)}
            fetchAccounts={fetchAccounts}
          />
        </Modal>
      )}

      {lastSelectedItem && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận xóa</ModalTitle>
          <ModalDescription>Bạn có chắc muốn xóa tài khoản ?</ModalDescription>
          <div className="flex justify-center gap-4">
            <Button
              size="small"
              onClick={() => setOpenDelete(false)}
              icon={<FontAwesomeIcon icon={faX} />}
            >
              Hủy
            </Button>
            <Button
              size="small"
              color="danger"
              onClick={handleDelete}
              icon={<FontAwesomeIcon icon={faTrash} />}
            >
              Xóa
            </Button>
          </div>
        </Modal>
      )}

      {lastSelectedItem && (
        <Modal open={openReset}>
          <ModalTitle>Xác nhận</ModalTitle>
          <ModalDescription>
            Bạn có chắc muốn đặt lại mật khẩu ?
          </ModalDescription>
          <div className="flex justify-center gap-4">
            <Button
              size="small"
              color="danger"
              onClick={() => setOpenReset(false)}
              icon={<FontAwesomeIcon icon={faX} />}
            >
              Hủy
            </Button>
            <Button
              size="small"
              color="success"
              onClick={handleReset}
              icon={<FontAwesomeIcon icon={faCheck} />}
            >
              Đồng ý
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default AccountTable;
