import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import { Account, Role } from "../utils/types/type";
import {
  CreateAccountDto,
  CreateRoleDto,
  UpdateAccountDto,
  UpdateRoleDto,
} from "../utils/types/dto";
import { Permission } from "../utils/types/enum";

export default class AccountApi {
  getAll = async () => {
    try {
      const { accounts } = await axiosClient.get<void, { accounts: Account[] }>(
        "/api/user/getAll"
      );
      return accounts;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  getAllRole = async () => {
    try {
      const { roles } = await axiosClient.get<void, { roles: Role[] }>(
        "/api/user/getAllRoles"
      );
      return roles;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  getAccountPermissions = async (account_id: string) => {
    try {
      const { permissions } = await axiosClient.get<
        void,
        { permissions: Permission[] }
      >("/api/user/getAccountPermissions", { params: { id: account_id } });
      return permissions;
    } catch (error: any) {
      const err = error.message ?? "Đã xảy ra lỗi";
      toast.error(err);
      return [];
    }
  };

  getRolePermission = async (role_id: string) => {
    try {
      const { perms } = await axiosClient.get<void, { perms: string[] }>(
        "/api/user/getRolePermission",
        { params: { id: role_id } }
      );
      return perms;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      throw new Error("Không thể lấy quyền hạn của vai trò");
    }
  };

  getAccountDetail = async (account_id: string) => {
    try {
      const { account } = await axiosClient.get<void, { account: Account }>(
        "/api/user/getAccountDetail",
        {
          params: {
            id: account_id,
          },
        }
      );
      return account;
    } catch (error: any) {
      toast.error(error.message ?? "Tài khoản không tồn tại");
      return null;
    }
  };

  createRole = async (dto: CreateRoleDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateRoleDto,
        { message: string }
      >("/api/user/createRole", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      throw new Error();
    }
  };

  updateRole = async (dto: UpdateRoleDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateRoleDto,
        { message: string }
      >("/api/user/updateRole", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      throw new Error();
    }
  };

  deleteRole = async (id: string) => {
    try {
      const { message } = await axiosClient.delete<string, { message: string }>(
        "/api/user/deleteRole",
        {
          params: {
            id: id,
          },
        }
      );
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      throw new Error();
    }
  };

  createAccount = async (dto: CreateAccountDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateAccountDto,
        { message: string }
      >("/api/user/createAccount", dto);
      return message;
    } catch (error: any) {
      throw new Error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  updateAccount = async (dto: UpdateAccountDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateAccountDto,
        { message: string }
      >("/api/user/updateAccount", dto);
      return message;
    } catch (error: any) {
      throw new Error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  deleteAccount = async (account_id: string) => {
    try {
      const { message } = await axiosClient.delete<void, { message: string }>(
        "/api/user/deleteAccount",
        { params: { id: account_id } }
      );
      return message;
    } catch (error: any) {
      throw new Error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  resetPassword = async (account_id: string) => {
    try {
      const { message } = await axiosClient.post<null, { message: string }>(
        "/api/user/resetPassword",
        null,
        { params: { id: account_id } }
      );
      return message;
    } catch (error: any) {
      throw new Error(error.message ?? "Đã xảy ra lỗi");
    }
  };
}
