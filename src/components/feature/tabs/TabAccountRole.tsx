import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Loading from "../../ui/Loading";
import FormAddRole from "../forms/FormAddRole";
import RoleTable from "../tables/TableRole";
import AccountApi from "../../../api/Account";
import { Role } from "../../../utils/types/type";

const TabAccountRole = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fetchRoles = async () => {
    const accountApi = new AccountApi();
    setLoading(true);
    const roles = await accountApi.getAllRole();
    setLoading(false);
    setRoles(roles);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Quản lý vai trò</h1>
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
        <RoleTable roles={roles} fetchRoles={fetchRoles}/>
      </div>
      <Modal open={openAdd}>
        <h4 className="text-2xl font-semibold">Thêm vai trò mới</h4>
        <FormAddRole close={() => setOpenAdd(false)} fetchRoles={fetchRoles}/>
      </Modal>
    </Fragment>
  );
};

export default TabAccountRole;
