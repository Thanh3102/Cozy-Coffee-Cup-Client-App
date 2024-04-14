import { ImportNoteDetail } from "./type.d";
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
  created_at: date;
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
  id: int;
  receiver_name: string;
  note: string;
  created_at: date;
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
  id: int;
  picker_name: string;
  note: string;
  created_at: date;
  user: {
    name: string;
  };
  export_note_detail: ExportNoteDetail[];
};
