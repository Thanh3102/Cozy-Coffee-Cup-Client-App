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
  active: boolean;
  unit: {
    id: number;
    name: string;
    short: string;
  };
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
