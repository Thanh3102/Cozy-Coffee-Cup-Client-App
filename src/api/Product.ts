import { toast } from "react-toastify";
import axiosClient from "../lib/axios";
import {
  Category,
  Product,
  ProductOption,
  ProductOverview,
  ProductType,
} from "../utils/types/type";
import {
  CreateCategoryDto,
  CreateProductDto,
  CreateProductOptionDto,
  CreateProductTypeDto,
  UpdateCategoryDto,
  UpdateProductDto,
  UpdateProductTypeDto,
} from "../utils/types/dto";

export default class ProductApi {
  // Product
  getAll = async () => {
    try {
      const { products } = await axiosClient.get<void, { products: Product[] }>(
        "/api/product/getAll"
      );
      return products;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu sản phẩm");
      return [];
    }
  };

  getProductById = async (id: number) => {
    try {
      const { product } = await axiosClient.get<void, { product: Product }>(
        `/api/product/findById`,
        {
          params: {
            id: id,
          },
        }
      );
      return product;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu sản phẩm");
    }
  };

  getOverview = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: ProductOverview }>(
        "/api/product/getProductOverview"
      );
      return data;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  createProduct = async (dto: CreateProductDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateProductDto,
        { message: string }
      >("/api/product/create", dto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateProduct = async (dto: UpdateProductDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateProductDto,
        { message: string }
      >("/api/product/update", dto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  // Category
  getAllCategory = async () => {
    try {
      const { categories } = await axiosClient.get<
        void,
        { categories: Category[] }
      >("/api/product/getCategory");
      return categories;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy thông tin danh mục");
      return [];
    }
  };

  searchCategory = async (query: string) => {
    try {
      const { categories } = await axiosClient.get<
        void,
        { categories: Category[] }
      >(`/api/product/getCategory`, {
        params: {
          q: query,
        },
      });
      return categories;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  createCategory = async (data: CreateCategoryDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateCategoryDto,
        { message: string }
      >("/api/product/createCategory", data);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateCategory = async (data: UpdateCategoryDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateCategoryDto,
        { message: string }
      >("/api/product/updateCategory", data);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  deleteCategory = async (id: number) => {
    try {
      const { message } = await axiosClient.delete<void, { message: string }>(
        `/api/product/deleteCategory`,
        {
          params: {
            id: id,
          },
        }
      );
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  // Type
  getAllType = async () => {
    try {
      const { types } = await axiosClient.get<void, { types: ProductType[] }>(
        "/api/product/getType"
      );
      return types;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
      return [];
    }
  };

  searchType = async (query: string) => {
    try {
      const { types } = await axiosClient.get<void, { types: ProductType[] }>(
        `/api/product/getType`,
        {
          params: {
            q: query,
          },
        }
      );
      return types;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  createType = async (data: CreateProductTypeDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateProductTypeDto,
        { message: string }
      >("/api/product/createType", data);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateType = async (data: UpdateProductTypeDto) => {
    try {
      const { message } = await axiosClient.post<
        UpdateProductTypeDto,
        { message: string }
      >("/api/product/updateType", data);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  deleteType = async (id: number) => {
    try {
      const { message } = await axiosClient.delete<void, { message: string }>(
        `/api/product/deleteType`,
        {
          params: {
            id: id,
          },
        }
      );
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  // Option
  searchOption = async (query: string) => {
    try {
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >(`/api/product/getOption`, {
        params: {
          q: query,
        },
      });
      return options;
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      return [];
    }
  };

  getAllOption = async () => {
    try {
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >("/api/product/getOption");
      return options;
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
      return [];
    }
  };

  getOptionByProductId = async (id: number) => {
    try {
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >(`api/product/getProductOption`, {
        params: {
          id: id,
        },
      });
      return options;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      return [];
    }
  };

  createOption = async (data: CreateProductOptionDto) => {
    try {
      const { message } = await axiosClient.post<
        CreateProductOptionDto,
        { message: string }
      >("/api/product/createOption", data);
      return message;
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  updateOption = async () => {};
  deleteOption = async () => {};
}
