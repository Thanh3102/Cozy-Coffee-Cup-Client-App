import { Fragment } from "react/jsx-runtime";
import { BaseProps } from "../../../utils/types/interface";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import Button from "../../ui/Button";
import Modal, { ModalTitle } from "../../ui/Modal";
import { useEffect, useState } from "react";
import FormUpdateProductOption from "../forms/FormUpdateProductOption";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { currencyFormatter } from "../../../utils/currencyFormat";

interface Props extends BaseProps {
  product_id: number;
}

type Option = {
  id: number;
  title: string;
  values: Array<{ id: number; name: string; price: number }>;
};

const TabProductOption = ({ product_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);

  const fetchOption = async () => {
    try {
      const { options } = await axiosClient.get<void, { options: Option[] }>(
        `api/product/getProductOption?id=${product_id}`
      );
      setOptions(options);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchOption();
  }, []);
  return (
    <Fragment>
      <div className="">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-[20px]">Danh sách tùy chọn</h1>
          <Button size="small" onClick={() => setOpen(true)}>
            Thay đổi
          </Button>
        </div>
        <Table height={400}>
          <TableHead>
            <TableRow>
              <TableCell>Tên tùy chọn</TableCell>
              <TableCell>Giá trị</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-semibold">{option.title}</TableCell>
                <TableCell>
                  <ul>
                    {option.values.map((value) => (
                      <li className="flex" key={value.id}>
                        <p className="flex-1 text-left">{value.name}</p>
                        <p className="flex-1 text-left">
                          {currencyFormatter.format(value.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal open={open}>
        <ModalTitle>Thay đổi tùy chọn</ModalTitle>
        <FormUpdateProductOption
          product_id={product_id}
          close={() => setOpen(false)}
          reFetchData={() => fetchOption()}
        />
      </Modal>
    </Fragment>
  );
};

export default TabProductOption;
