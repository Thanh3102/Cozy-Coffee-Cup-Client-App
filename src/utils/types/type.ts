import { OrderStatus, OrderType } from "./enum";

export type User = {
  id: string;
  name: string;
  username: string;
  role: string;
};

export type Material = {
  id: number;
  name: string;
  stock_quantity: number;
  expiration_date: Date;
  latest_import_date: Date;
  latest_export_date: Date;
  min_stock: number;
  active: boolean;
  unit: {
    id: number;
    name: string;
    short: string;
  };
};

export type Unit = {
  id: number;
  name: string;
  short: string;
};

export type Provider = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
};

export type ImportItem = {
  material: Material | undefined | null;
  price: number;
  quantity: number;
};

export type ExportItem = {
  material: Material | undefined | null;
  quantity: number;
};

export type HistoryListItem = {
  type: string;
  id: number;
  created_at: Date;
  user: {
    name: string;
  };
};

export type ImportNoteDetail = {
  price: number;
  quantity: number;
  material: {
    name: string;
    unit: Unit;
  };
};

export type ImportNote = {
  id: number;
  receiver_name: string;
  note: string;
  created_at: Date;
  user: {
    name: string;
  };
  import_note_detail: ImportNoteDetail[];
  provider: {
    name: string;
  };
};

export type ExportNoteDetail = {
  quantity: number;
  material: {
    name: string;
    unit: Unit;
  };
};

export type ExportNote = {
  id: number;
  picker_name: string;
  note: string;
  created_at: Date;
  user: {
    name: string;
  };
  export_note_detail: ExportNoteDetail[];
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  type: ProductType;
  note: string;
  sold: number;
  discount: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Category = {
  id: number;
  name: string;
};

export type ProductDetail = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  type: {
    id: number;
    name: string;
  };
  status: boolean;
  sold: number;
  note: string;
  discount: number;
  created_at: Date;
  updated_at: Date;
  category: {
    id: number;
    name: string;
  };
};

export type ProductOption = {
  id: number;
  title: string;
  required: boolean;
  allows_multiple: boolean;
  values: {
    id: number;
    name: string;
    price: number;
  }[];
};

export type ProductType = {
  id: number;
  name: string;
};

export type Table = {
  id: number;
  floor: number;
  number: number;
  order_id: number;
};

export type Order = {
  id: number;
  note: string;
  created_at: Date;
  status: OrderStatus;
};

export type OrderItem = {
  id?: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  is_gift: boolean;
  options: Option[];
};

export type Option = {
  id: number;
  title: string;
  values: Array<{ id: number; name: string; price: number }>;
};

export type ResponseOrderItem = {
  id: number;
  product: {
    name: string;
  };
  quantity: number;
  price: number;
  discount: number;
  is_gift: boolean;
  options: Option[];
};

export type OrderDetail = {
  id: number;
  type: OrderType;
  status: OrderStatus;
  note: string;
  created_at: Date;
  orderItems: Array<OrderDetailItem>;
};

export type OrderDetailItem = {
  id: number;
  quantity: number;
  price: number;
  discount: number;
  isGift: boolean;
  product_id: number;
  order_id: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  order_item_options: Array<ItemOption>;
};

export type ItemOption = {
  id: number;
  title: string;
  order_item_option_values: Array<ItemOptionValue>;
};

export type ItemOptionValue = {
  id: number;
  name: string;
  price: number;
};

export type PaymentMethod = {
  id: number;
  type: string;
};

export type ProductOverview = {
  categoryCount: number;
  numberOfSellProduct: number;
  numberOfProduct: number;
  revenueLast7Day: number;
  bestSellingProduct: string;
};

export type RevenueOverview = {
  revenue: number;
  numberOfOrder: number;
};
