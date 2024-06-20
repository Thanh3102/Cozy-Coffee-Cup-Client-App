import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { currencyFormatter } from "../../utils/currencyFormat";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRotate, faX } from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../ui/Modal";
import FormAddProduct from "../feature/forms/FormAddProduct";
import { Fragment, useEffect, useState } from "react";
import {
  ProductOverview as ProductOverviewType,
  Product as ProductType,
} from "../../utils/types/type";
import ProductDetail from "../feature/ProductDetail";
import Loading from "../ui/Loading";
import ProductOverview from "../feature/ProductOverview";
import ProductApi from "../../api/Product";

const ProductContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [overview, setOverview] = useState<ProductOverviewType>({
    categoryCount: 0,
    numberOfSellProduct: 0,
    numberOfProduct: 0,
    revenueLast7Day: 0,
    bestSellingProduct: "",
  });
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const [products, setProducts] = useState<ProductType[]>([]);

  const fetchProduct = async () => {
    setLoading(true);
    const productApi = new ProductApi();
    const products = await productApi.getAll();
    setLoading(false);
    setProducts(products);
  };

  const fetchProductOverview = async () => {
    setLoading(true);
    const productApi = new ProductApi();
    const overview = await productApi.getOverview();
    overview && setOverview(overview);
    setLoading(false);
  };

  const handleRefresh = () => {
    fetchProduct();
    fetchProductOverview();
  };

  useEffect(() => {
    fetchProduct();
    fetchProductOverview();
  }, []);

  return (
    <ContentContainer>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <ProductOverview overview={overview} />
          <div className="p-4 rounded-lg bg-white mt-4 shadow-md">
            <div className="flex justify-between">
              <span className="font-bold text-[22px]">Sản phẩm</span>
              <div className="flex justify-end gap-4">
                <Button
                  size="small"
                  type="button"
                  icon={<FontAwesomeIcon icon={faRotate} />}
                  onClick={handleRefresh}
                >
                  Làm mới
                </Button>
                <Button
                  size="small"
                  color="success"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setOpenAdd(true)}
                >
                  Thêm mới
                </Button>
              </div>
            </div>
            <Table height={500}>
              <TableHead sticky>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Giá bán</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  return (
                    <TableRow
                      key={product.id}
                      onClick={() => {
                        setOpenDetail(true);
                        setSelectedProduct(product);
                      }}
                      className="hover: cursor-pointer"
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {product?.category?.name ?? "Trống"}
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(product.price)}
                      </TableCell>
                      <TableCell>{product.type.name}</TableCell>
                      <TableCell>
                        {product.status ? "Đang bán" : "Ngừng bán"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Modal open={openAdd}>
            <ModalTitle>Thêm sản phẩm mới</ModalTitle>
            <FormAddProduct
              closeModal={() => setOpenAdd(false)}
              fetchProduct={fetchProduct}
            />
          </Modal>
          <Modal open={openDetail}>
            {selectedProduct && (
              <ProductDetail
                product_id={selectedProduct.id}
                closeModal={() => setOpenDetail(false)}
              />
            )}
          </Modal>
        </Fragment>
      )}
    </ContentContainer>
  );
};

const Product = () => {
  return (
    <div className="flex">
      <Sidebar />
      <ProductContent />
    </div>
  );
};

export default Product;
