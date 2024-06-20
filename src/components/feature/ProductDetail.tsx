import { Fragment } from "react/jsx-runtime";
import { Product } from "../../utils/types/type";
import { BaseProps } from "../../utils/types/interface";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faX } from "@fortawesome/free-solid-svg-icons";
import { Tab, TabContainer } from "../ui/TabContainer";
import TabProductInfo from "./tabs/TabProductInfo";
import TabProductOption from "./tabs/TabProductOption";
import Modal, { ModalTitle } from "../ui/Modal";
import { useEffect, useState } from "react";
import FormEditProduct from "./forms/FormEditProduct";
import ProductApi from "../../api/Product";

interface Props extends BaseProps {
  product_id: number;
  closeModal: () => void;
}

const ProductDetail = ({ product_id, closeModal }: Props) => {
  const [product, setProduct] = useState<Product | undefined>();
  const tabs: Tab[] = [
    { title: "Thông tin", content: <TabProductInfo product={product} /> },
    {
      title: "Tùy chọn",
      content: <TabProductOption product_id={product_id} />,
    },
  ];

  const fetchProduct = async () => {
    const productApi = new ProductApi();
    const product = await productApi.getProductById(product_id);
    setProduct(product);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  return (
    <Fragment>
      {product && (
        <div className="">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[20px]">{product.name}</span>
            <div className="flex gap-4">
              <Button
                size="small"
                color="warning"
                icon={<FontAwesomeIcon icon={faEdit} />}
                onClick={() => setOpenEdit(true)}
              >
                Chỉnh sửa
              </Button>
              <Button
                size="small"
                color="danger"
                icon={<FontAwesomeIcon icon={faX} />}
                onClick={closeModal}
              >
                Đóng
              </Button>
            </div>
          </div>
          <TabContainer size="small" tabs={tabs} />
        </div>
      )}
      <Modal open={openEdit}>
        <ModalTitle>Chỉnh sửa thông tin sản phẩm</ModalTitle>
        {product && (
          <FormEditProduct
            product={product}
            close={() => setOpenEdit(false)}
            fetchProduct={fetchProduct}
          />
        )}
      </Modal>
    </Fragment>
  );
};

export default ProductDetail;
