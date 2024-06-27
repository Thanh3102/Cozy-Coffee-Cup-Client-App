import { Fragment } from "react/jsx-runtime";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { Role } from "../../../utils/types/type";
import { formatDate } from "../../../utils/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Modal, { ModalDescription, ModalTitle } from "../../ui/Modal";
import FormEditRole from "../forms/FormEditRole";
import Button from "../../ui/Button";
import AccountApi from "../../../api/Account";
import { toast } from "react-toastify";

interface Props {
  roles: Role[];
  fetchRoles: () => void;
}

const RoleTable = ({ roles, fetchRoles }: Props) => {
  const [lastSelected, setLastSelected] = useState<Role>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      if (lastSelected) {
        const accountApi = new AccountApi();
        const message = await accountApi.deleteRole(lastSelected.id);
        toast.success(message);
        fetchRoles();
        setOpenDelete(false);
      }
    } catch (error) {
      return;
    }
  };

  return (
    <Fragment>
      <Table height={"60vh"}>
        <TableHead bgColor={"#37B7C3"}>
          <TableRow>
            <TableCell className="table-cell max-w-0">Tên vai trò</TableCell>
            <TableCell className="table-cell max-w-0">Tạo bởi</TableCell>
            <TableCell className="table-cell max-w-0">Ngày tạo</TableCell>
            <TableCell className="table-cell max-w-0">
              Số lượng tài khoản
            </TableCell>
            <TableCell align="center" className="table-cell max-w-0">
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="table-cell max-w-0">
                <span style={{ color: role.color }}>{role.name}</span>
              </TableCell>
              <TableCell className="table-cell max-w-0">
                {role.user.username}
              </TableCell>
              <TableCell className="table-cell max-w-0">
                {formatDate(role.created_at)}
              </TableCell>
              <TableCell className="table-cell max-w-0">
                {role._count.user_role}
              </TableCell>
              <TableCell align="center" className="table-cell max-w-0">
                <div className="flex gap-5 justify-center">
                  <span
                    className="hover:cursor-pointer hover:text-yellow-600"
                    title="Chỉnh sửa"
                    onClick={() => {
                      setLastSelected(role);
                      setOpenEdit(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faGear} />
                  </span>
                  <span
                    className="hover:cursor-pointer hover:text-red-600"
                    title="Xóa vai trò"
                    onClick={() => {
                      setLastSelected(role);
                      setOpenDelete(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {lastSelected && (
        <Modal open={openEdit}>
          <FormEditRole
            role={lastSelected}
            close={() => setOpenEdit(false)}
            fetchRole={fetchRoles}
          />
        </Modal>
      )}
      {lastSelected && (
        <Modal open={openDelete}>
          <ModalTitle>Xác nhận</ModalTitle>
          <ModalDescription>
            Bạn có chắc muốn xóa vai trò{" "}
            <span style={{ color: lastSelected.color }}>
              {lastSelected.name}
            </span>{" "}
            ?
          </ModalDescription>
          <div className="flex gap-4 justify-end">
            <Button
              size="small"
              icon={<FontAwesomeIcon icon={faX} />}
              onClick={() => setOpenDelete(false)}
            >
              Hủy
            </Button>
            <Button
              size="small"
              color="danger"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default RoleTable;
