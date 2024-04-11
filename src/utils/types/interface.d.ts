export interface BaseProps {
  children?: React.ReactNode | string;
  className?: string;
}

export interface SignInFormInput {
  username: string;
  password: string;
}

export interface CreateImportNoteDto {
  receiver_name: string;
  note: string;
  provider_id: string;
  import_note_detail: {
    price: number;
    quantity: number;
    material_id: number | undefined;
  }[];
}

export interface CreateExportNoteDto {
  picker_name: string;
  note: string;
  export_note_detail: {
    quantity: number;
    material_id: number | undefined;
  }[];
}
