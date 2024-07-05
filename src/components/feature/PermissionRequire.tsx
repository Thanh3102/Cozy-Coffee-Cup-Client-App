import { Fragment, useEffect, useState } from "react";
import { useAppSelector } from "../../redux/store";
import { Permission } from "../../utils/types/enum";
import { BaseProps } from "../../utils/types/interface";
import AccountApi from "../../api/Account";
import DeniedAccess from "../page/DeniedAccess";
import Loading from "../ui/Loading";

interface Props extends BaseProps {
  require: Permission;
}

const PermissionRequire = ({ require, children }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const [permissions, setPermissions] = useState<Permission[]>();
  const getUserPermission = async () => {
    if (user) {
      const accountApi = new AccountApi();
      const perms = await accountApi.getAccountPermissions(user.id);
      setPermissions(perms);
    }
  };

  useEffect(() => {
    getUserPermission();
  }, []);

  if (permissions) {
    if (permissions.includes(require)) {
      return <Fragment>{children}</Fragment>;
    }
  } else {
    return <Loading />;
  }
  return <DeniedAccess />;
};

export default PermissionRequire;
