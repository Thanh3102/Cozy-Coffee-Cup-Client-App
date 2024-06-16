import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { currencyFormatter } from "../../utils/currencyFormat";
import Table, { TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faPlus,
  faRotate,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Modal, { ModalTitle } from "../ui/Modal";
import FormAddProduct from "../feature/forms/FormAddProduct";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ProductOverview,
  Product as ProductType,
} from "../../utils/types/type";
import axiosClient from "../../lib/axios";
import { toast } from "react-toastify";
import ProductDetail from "../feature/ProductDetail";
import { KeyframeOptions, animate, easeInOut, useAnimate } from "framer-motion";
import { BaseProps } from "../../utils/types/interface";
import Loading from "../ui/Loading";
import AnimateNumber from "../ui/AnimateNumber";

const ProductContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [overview, setOverview] = useState<ProductOverview>({
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
    try {
      const response = await axiosClient.get<void, { products: ProductType[] }>(
        "/api/product/getAll"
      );
      setProducts(response.products);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu sản phẩm");
      setLoading(false);
    }
  };

  const fetchProductOverview = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<void, { data: ProductOverview }>(
        "/api/product/getProductOverview"
      );
      setOverview(response.data);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
      setLoading(false);
    }
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
          <div className="p-4 rounded-lg bg-white shadow-md">
            <h1 className="text-[20px] font-bold">Tổng quan sản phẩm</h1>
            <ul className="flex justify-between mt-4 [&>li]:px-10 [&>:first-child]:pl-0 [&>:last-child]:pr-0 [&>:last-child]:border-none">
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-blue-500">Danh mục</p>
                <AnimateNumber from={0} to={overview.categoryCount} />
              </li>
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-amber-500">Số sản phẩm</p>
                <div className="font-semibold flex justify-between">
                  <AnimateNumber from={0} to={overview.numberOfSellProduct} />
                  <AnimateNumber from={0} to={overview.numberOfProduct} />
                </div>
                <div className="text-[14px] text-gray-500 flex justify-between">
                  <p className="">Đang bán</p>
                  <p className="">Tổng</p>
                </div>
              </li>
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-purple-500">Doanh thu</p>
                <p className="font-semibold ">
                  <AnimateNumber
                    from={0}
                    to={overview.revenueLast7Day}
                    currency={true}
                  />
                </p>
                <p className="text-[14px] text-gray-500">7 ngày gần nhất</p>
              </li>
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-orange-500">Bán chạy</p>
                <p className="font-semibold">{overview.bestSellingProduct}</p>
              </li>
            </ul>
          </div>
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
            <div
              className="flex justify-between items-center cursor-pointer py-1"
              onClick={() => {
                setOpenAdd(false);
              }}
            >
              <ModalTitle>Thêm sản phẩm</ModalTitle>
              <FontAwesomeIcon icon={faX} />
            </div>
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
