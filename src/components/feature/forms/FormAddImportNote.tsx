import { Fragment } from "react/jsx-runtime";
import Button from "../../ui/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../ui/Table";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../../ui/Modal";
import FormAddImportItem from "./FormAddImportItem";
import { ImportItem, Provider } from "../../../utils/types/type";
import { currencyFormatter } from "../../../utils/currencyFormat";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseProps } from "../../../utils/types/interface";
import { toast } from "react-toastify";
import { CreateImportNoteDto } from "../../../utils/types/dto";
import MaterialApi from "../../../api/Material";
import ProviderApi from "../../../api/Provider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../ui/ErrorMessage";

interface Props extends BaseProps {
  closeModal: () => void;
  reFetchMaterial: () => void;
}

const noteSchema = z.object({
  receiver_name: z.string().min(1, { message: "Chưa nhập giá trị" }),
  provider_id: z.string().min(1, { message: "Chưa nhập giá trị" }),
  note: z.string(),
  total: z.number(),
});

type Inputs = z.infer<typeof noteSchema>;

const FormAddImportNote = ({ closeModal, reFetchMaterial }: Props) => {
  const [deliveryItems, setImportItems] = useState<ImportItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [openAddImportItem, setOpenAddImportItem] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(noteSchema) });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const importList: {
      price: number;
      quantity: number;
      material_id: number;
    }[] = [];

    if (deliveryItems.length !== 0) {
      deliveryItems.forEach((item) => {
        if (item?.material?.id) {
          importList.push({
            price: item.price,
            quantity: item.quantity,
            material_id: item.material.id,
          });
        }
      });
    } else {
      toast.error("Danh sách nguyên liệu trống");
      return;
    }

    const dto: CreateImportNoteDto = {
      import_note_detail: importList,
      ...data,
    };

    const materialApi = new MaterialApi();
    const message = await materialApi.createImportNote(dto);
    if (message !== null) {
      message && toast.success("Đã tạo phiếu nhập kho");
    }
    closeModal();
    reFetchMaterial();
  };

  const countTotal = (items: ImportItem[]) => {
    const total = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setValue("total", total);
    return total;
  };

  const fetchProviders = async () => {
    const providerApi = new ProviderApi();
    const providers = await providerApi.getAllActive();
    setProviders(providers);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[50vw] min-w-[500px]"
      >
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="">Tên người nhập</label>
            <input
              type="text"
              className="input"
              {...register("receiver_name", { required: true })}
            />
            {errors.receiver_name && (
              <ErrorMessage>{errors.receiver_name.message}</ErrorMessage>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="provider_id">Nhà cung cấp</label>
            <select
              className="input"
              id="provider_id"
              {...register("provider_id", { required: true })}
            >
              <option value="" hidden>
                Chọn nhà cung cấp
              </option>
              {providers.map((provider) => {
                return (
                  <option value={provider.id} key={provider.id}>
                    {provider.name}
                  </option>
                );
              })}
            </select>
            {errors.provider_id && (
              <ErrorMessage>{errors.provider_id.message}</ErrorMessage>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center my-3">
          <h5 className="font-semibold text-lg">Danh sách nguyên liệu</h5>
          <Button
            size="small"
            type="button"
            color="success"
            onClick={() => setOpenAddImportItem(true)}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm
          </Button>
        </div>
        <Table height={200}>
          <TableHead sticky>
            <TableRow className="text-sm">
              <TableCell>Tên nguyên liệu</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryItems.map((deliveryItem) => (
              <TableRow key={deliveryItem.material?.id}>
                <TableCell>{deliveryItem.material?.name}</TableCell>
                <TableCell>{deliveryItem.quantity}</TableCell>
                <TableCell>
                  {currencyFormatter.format(deliveryItem.price)}
                </TableCell>
                <TableCell>
                  {currencyFormatter.format(
                    deliveryItem.price * deliveryItem.quantity
                  )}
                </TableCell>
                <TableCell>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="hover:text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      setImportItems(
                        deliveryItems.filter(
                          (item) =>
                            item.material?.id !== deliveryItem.material?.id
                        )
                      );
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end my-2">
          <span className="font-semibold text-[16px]">{`Thành tiền: ${currencyFormatter.format(
            countTotal(deliveryItems)
          )}`}</span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="note">Ghi chú</label>
          <textarea
            id="note"
            cols={10}
            rows={5}
            className="border-[1px] border-black rounded-lg p-2 resize-none"
            {...register("note")}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4 gap-4">
          <Button
            size="small"
            color="danger"
            icon={<FontAwesomeIcon icon={faX} />}
            onClick={closeModal}
          >
            Đóng
          </Button>
          <Button
            size="small"
            color="success"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Tạo
          </Button>
        </div>
      </form>
      <Modal open={openAddImportItem}>
        <ModalTitle>Chọn nguyên liệu</ModalTitle>
        <FormAddImportItem
          setImportItems={setImportItems}
          closeModal={() => setOpenAddImportItem(false)}
        />
      </Modal>
    </Fragment>
  );
};

export default FormAddImportNote;
