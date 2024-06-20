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
import { ProductOption } from "../../../utils/types/type";
import ProductApi from "../../../api/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface Props extends BaseProps {
  product_id: number;
}

// type Option = {
//   id: number;
//   title: string;
//   values: Array<{ id: number; name: string; price: number }>;
// };

const TabProductOption = ({ product_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<ProductOption[]>([]);

  const fetchOption = async () => {
    const productApi = new ProductApi();
    const options = await productApi.getOptionByProductId(product_id);
    setOptions(options);
  };

  useEffect(() => {
    fetchOption();
  }, []);
  return (
    <Fragment>
      <div className="overflow-y-auto w-[80vw] h-[70vh]">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-[20px]">Danh sách tùy chọn</h1>
          <Button
            size="small"
            onClick={() => setOpen(true)}
            icon={<FontAwesomeIcon icon={faPen} />}
          >
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
