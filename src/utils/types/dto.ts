export type CreateUnitDto = {
  name: string;
  short: string;
};

export type UpdateUnitDto = {
  id: number;
  name: string;
  short: string;
};

export type CreateCategoryDto = {
  name: string;
};

export type UpdateCategoryDto = {
  id: number;
  name: string;
};

export type CreateProductTypeDto = {
  name: string;
};

export type UpdateProductTypeDto = {
  id: number;
  name: string;
};

export type CreateProductOptionDto = {
  title: string;
  required: boolean;
  allows_multiple: boolean;
  values: { name: string; price: number }[];
};

export type UpdateProductOptionDto = {
  id: number;
  title: string;
  required: boolean;
  allows_multiple: boolean;
};

export type CreateProductDto = {
  name: string;
  price: number;
  type_id: number;
  category_id: number;
  description: string;
  note: string;
  image: File;
};

export type UpdateProductDto = {
  id: number;
  name: string;
  price: number;
  type_id: number;
  category_id: number;
  description: string;
  note: string;
  image: File;
  discount: number;
  status: boolean;
};

export type CreateMaterialDto = {
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  unit_id: number;
  min_stock: number;
};

export type UpdateMaterialDto = {
  id: number;
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  unit_id: number;
  min_stock: number;
  active: boolean;
};

export type CreateImportNoteDto = {
  receiver_name: string;
  note: string;
  provider_id: string;
  import_note_detail: {
    price: number;
    quantity: number;
    material_id: number;
  }[];
};

export type CreateExportNoteDto = {
  picker_name: string;
  note: string;
  export_note_detail: {
    quantity: number;
    material_id: number | undefined;
  }[];
};

export type CreateProviderDto = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type UpdateProviderDto = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
};

export type CreateOrderDto = {
  note: string;
  type?: string;
  total: number;
  items: Array<{
    discount: number;
    is_gift: boolean;
    name: string;
    price: number;
    product_id: number;
    quantity: number;
    options: Array<{
      id: number;
      title: string;
      values: Array<{ id: number; name: string; price: number }>;
    }>;
  }>;
};

export type UpdateOrderDto = {
  id: number;
  note: string;
  type: string;
  total: number;
  items: Array<{
    id?: number;
    discount: number;
    is_gift: boolean;
    name: string;
    price: number;
    product_id: number;
    quantity: number;
    options: Array<{
      id: number;
      title: string;
      values: Array<{ id: number; name: string; price: number }>;
    }>;
  }>;
  deleteItems: Array<number>;
};

export type PayOrderDto = {
  id: number;
  paymentMethod: number;
  paymentAt: Date;
};
