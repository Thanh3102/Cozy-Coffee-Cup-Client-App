import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import { HistoryListItem, Material, Unit } from "../utils/types/type";
import {
  CreateExportNoteDto,
  CreateImportNoteDto,
  CreateMaterialDto,
  CreateUnitDto,
  UpdateMaterialDto,
  UpdateUnitDto,
} from "../utils/types/dto";

export default class MaterialApi {
  fetchUnit = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: Unit[] }>(
        "/api/material/getUnits"
      );
      return data;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu 1234");
      return [];
    }
  };

  searchUnit = async (query: string) => {
    try {
      const { data } = await axiosClient.get<void, { data: Unit[] }>(
        `/api/material/getUnits`,
        {
          params: {
            q: query,
          },
        }
      );
      return data;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  createUnit = async (data: CreateUnitDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateUnitDto,
        { status: number; message: string }
      >("/api/material/createUnit", data);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateUnit = async (data: UpdateUnitDto) => {
    try {
      const response = await axiosClient.post<
        UpdateUnitDto,
        { status: number; message: string }
      >("/api/material/updateUnit", data);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  deleteUnit = async (id: number) => {
    try {
      const { message } = await axiosClient.delete<void, { message: string }>(
        "/api/material/deleteUnit",
        {
          params: {
            id: id,
          },
        }
      );
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  // Material

  getAllActive = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: Material[] }>(
        "/api/material/getAllActive"
      );
      return data;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  getMaterialByFilter = async (page: number, itemPerPage: number) => {
    try {
      const { data, count } = await axiosClient.get<
        void,
        { data: Material[]; count: number }
      >(`/api/material/getAll?page=${page}&item=${itemPerPage}`);
      return { data, count };
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return {
        data: [],
        count: 0,
      };
    }
  };

  searchMaterial = async (query: string, signal: AbortSignal) => {
    try {
      const { materials } = await axiosClient.get<
        void,
        { materials: Material[] }
      >(`/api/material/search`, {
        params: {
          q: query,
        },
        signal: signal,
      });
      return materials;
    } catch (error: any) {
      console.log(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  createMaterial = async (dto: CreateMaterialDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateMaterialDto,
        { message: string }
      >("/api/material/addMaterial", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateMaterial = async (dto: UpdateMaterialDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateMaterialDto,
        { message: string }
      >("/api/material/updateMaterial", dto);
      return message;
    } catch (error: any) {
      toast.error(
        `${error.message ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại"}`
      );
      return null;
    }
  };

  // Import-Export Note
  createImportNote = async (dto: CreateImportNoteDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateImportNoteDto,
        { message: string }
      >("/api/import-export/createImportNote", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  createExportNote = async (dto: CreateExportNoteDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateExportNoteDto,
        { message: String }
      >("/api/import-export/createExportNote", dto);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  deleteNote = async (type: "Import" | "Export", id: number) => {
    try {
      const { message } = await axiosClient.post<void, { message: string }>(
        `/api/import-export/delete${type}Note?id=${id}`
      );
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return null;
    }
  };

  getAllUnVoidNote = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: HistoryListItem[] }>(
        "/api/import-export/getByFilter"
      );
      return data;
    } catch (error: any) {
      toast.error(error.mesage ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  getAllUnVoidNoteByFilter = async (
    start?: string,
    end?: string,
    type?: string,
    name?: string
  ) => {
    try {
      const { data } = await axiosClient.get<void, { data: HistoryListItem[] }>(
        `/api/import-export/getByFilter`,
        {
          params: {
            start: start ?? "",
            end: end ?? "",
            type: type ?? "",
            name: name ?? "",
          },
        }
      );
      return data;
    } catch (error: any) {
      toast.error(error.mesage ?? "Đã có lỗi xảy ra");
      return [];
    }
  };
}
